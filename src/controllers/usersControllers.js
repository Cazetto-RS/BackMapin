// controllers/usersController.js
import * as User  from '../models/usersModels.js';
import * as response from '../utils/response.js';
import * as Sessoes from '../models/sessoesModel.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();

        return response.success(res, "Users fetched successfully", users);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.getById(id);

        if (!user) {
            return response.notFound(res, "User not found");
        }

        return response.success(res, "User fetched successfully", user);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const getByCpf = async (req, res) => {
    try {
        const { cpf } = req.params;

        const user = await User.getBycpf(cpf);

        if (!user) {
            return response.notFound(res, "User not found");
        }

        return response.success(res, "User fetched successfully", user);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const createUsers = async (req, res) => {
    try {
        const newUser = await User.createUsers(req.body);

        return response.created(res, "User created successfully", newUser);

    } catch (error) {
        if (error.code === "23505") { // unique_violation do PostgreSQL
            return response.badRequest(res, "cpf already in use");
        }

        return response.serverError(res, error);
    }
};

export const updateUsers = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedUser = await User.updateUsers(id, req.body);

        if (!updatedUser) {
            return response.notFound(res, "User not found");
        }

        return response.updated(res, "User updated successfully", updatedUser);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const deleteUsers = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await User.deleteUsers(id);

        if (!deleted) {
            return response.notFound(res, "User not found");
        }

        return response.deleted(res, "User deleted successfully");

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const login = async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        if (!cpf || !senha) {
            return res.status(400).json({ error: "CPF e senha são obrigatórios" });
        }

        const users = await User.login(cpf, senha);

        if (!users) {
            console.log(senha, cpf)
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const horas_validade = 36;

        const sessao = await Sessoes.criar(users.id, horas_validade);

        const token = `${users.id}.${sessao.token}`;

        const data = {
            token,
            expiracao: sessao.validade,
            users
        };

        return res.json({
            message: "Login realizado com sucesso",
            data
        });

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};
