import * as sessoesModel from '../models/sessoesModel.js';
import * as sessoesCache from '../utils/sessoesCache.js';
import * as responses from '../utils/response.js';

// importa models:
import * as Enterprise from '../models/enterpriseModels.js';
import * as Users from '../models/usersModels.js';

export default async function autenticar(req, res, next) {
    try {
        const authorizationHeader = req.headers["authorization"];

        if (!authorizationHeader) {
            return responses.error(res, {
                statusCode: 498,
                message: "Token de autenticação não fornecido"
            });
        }

        const [bearer, fullToken] = authorizationHeader.split(" ");

        if (bearer !== "Bearer" || !fullToken) {
            return responses.error(res, {
                statusCode: 498,
                message: "Formato de token inválido"
            });
        }

        const [loginId, token] = fullToken.split(".");

        if (!loginId || !token) {
            return responses.error(res, {
                statusCode: 498,
                message: "Token inválido"
            });
        }

        // 1️⃣ Buscar no cache
        let sessao = sessoesCache.buscarSessao(loginId);

        if (!sessao) {
            // 2️⃣ Buscar no banco
            sessao = await sessoesModel.buscarSessao(loginId, token);

            if (!sessao) {
                return responses.error(res, {
                    statusCode: 498,
                    message: "Token de autenticação inválido"
                });
            }

            // 3️⃣ Validar tempo
            const validade = new Date(sessao.validade);
            if (validade < new Date()) {
                return responses.error(res, {
                    statusCode: 498,
                    message: "Token expirado"
                });
            }

            sessoesCache.addSessao(loginId, token);
        }

        // 4️⃣ VERIFICAR SE É ENTERPRISE OU USER
        let enterprise = await Enterprise.getById(loginId);
        let user = null;

        if (!enterprise) {
            user = await Users.getById(loginId);
        }

        if (!enterprise && !user) {
            return responses.error(res, {
                statusCode: 498,
                message: "Entidade não encontrada para este token"
            });
        }

        // 5️⃣ COLOCAR TIPO CORRETO NA REQUEST
        if (enterprise) {
            req.enterprise = enterprise;
        } else {
            req.user = user;
        }

        req.loginId = loginId;

        return next();

    } catch (error) {
        return responses.error(res, {
            statusCode: 500,
            message: `Erro interno do servidor: ${error.message}`
        });
    }
}
