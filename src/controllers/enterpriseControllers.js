// controllers/usersController.js
import * as Enterprise  from '../models/enterpriseModels.js';
import * as response from '../utils/response.js';
import * as Sessoes from '../models/sessoesModel.js';
import { gerarCodigo } from '../utils/codeGenerator.js';
import pool from '../database/data.js';

export const getAllEnterprise = async (req, res) => {
    try {
        const enterprises = await Enterprise.getAllEnterprise();

        return response.success(res, "Enterprises fetched successfully", enterprises);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        const enterprise = await Enterprise.getById(id);

        if (!enterprise) {
            return response.notFound(res, "Enterprise not found");
        }

        return response.success(res, "Enterprise fetched successfully", enterprise);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const getByCnpj = async (req, res) => {
    try {
        const { cnpj } = req.params;

        const enterprise = await Enterprise.getByCnpj(cnpj);

        if (!enterprise) {
            return response.notFound(res, "Enterprise not found");
        }

        return response.success(res, "Enterprise fetched successfully", enterprise);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const createUsers = async (req, res) => {
    try {
        const newEnterprise = await Enterprise.createEnterprise(req.body);

        return response.created(res, "Enterprise created successfully", newEnterprise);

    } catch (error) {
        if (error.code === "23505") { // unique_violation do PostgreSQL
            return response.badRequest(res, "cnpj already in use");
        }

        return response.serverError(res, error);
    }
};

// export const updateUsers = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const updatedUser = await Enterprise.updateUsers(id, req.body);

//         if (!updatedUser) {
//             return response.notFound(res, "Enterprise not found");
//         }

//         return response.updated(res, "Enterprise updated successfully", updatedUser);

//     } catch (error) {
//         return response.serverError(res, error);
//     }
// };

export const deleteEnterprise = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Enterprise.deleteEnterprise(id);

        if (!deleted) {
            return response.notFound(res, "Enterprise not found");
        }

        return response.deleted(res, "Enterprise deleted successfully");

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const login = async (req, res) => {
    try {
        const { cnpj, senha, code } = req.body;

        // Validar campos obrigatórios
        if (!cnpj || !senha || !code) {
            return response.badRequest(res, "cnpj, senha e code são obrigatórios");
        }

        // 1️⃣ LOGIN por CNPJ + senha
        const enterprise = await Enterprise.login(cnpj, senha);

        if (!enterprise) {
            return response.unauthorized(res, "Credenciais inválidas");
        }

        // 2️⃣ VALIDAR CODE DIGITADO
        if (enterprise.code !== code) {
            return response.forbidden(res, "Código da enterprise incorreto");
        }

        // 3️⃣ GERAR NOVO CODE
        const novoCodigo = gerarCodigo();

        await pool.query(
            "UPDATE enterprise SET code = $1 WHERE id = $2",
            [novoCodigo, enterprise.id]
        );

        console.log("NOVO CODE GERADO:", novoCodigo);

        // 4️⃣ GERAR SESSÃO (TOKEN)
        const validade_horas = 36;
        const sessao = await Sessoes.criar(enterprise.id, validade_horas);

        const token = `${enterprise.id}.${sessao.token}`;

        const data = {
            token,
            expiracao: sessao.validade,
            enterprise: {
                ...enterprise,
                code: novoCodigo
            }
        };

        return response.success(res, "Login realizado com sucesso", data);

    } catch (error) {
        console.error("Erro no login:", error);
        return response.serverError(res, error);
    }
};