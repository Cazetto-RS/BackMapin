import * as sessoesModel from '../models/sessoesModel.js';
import * as sessoesCache from '../utils/sessoesCache.js';
import * as responses from '../utils/response.js';

export default async function autenticar(req, res, next) {
    try {
        const authorizationHeader = req.headers["authorization"];

        if (!authorizationHeader) {
            return responses.error(res, {
                statusCode: 498,
                message: "Token de autenticação não fornecido"
            });
        }

        // Formato esperado: Bearer loginId.token
        const [bearer, fullToken] = authorizationHeader.split(" ");

        if (bearer !== "Bearer" || !fullToken) {
            return responses.error(res, {
                statusCode: 498,
                message: "Formato de token inválido"
            });
        }

        // Token está no formato "loginId.token"
        const [loginId, token] = fullToken.split(".");

        if (!loginId || !token) {
            return responses.error(res, {
                statusCode: 498,
                message: "Token inválido"
            });
        }

        // 1️⃣ Tentativa de encontrar no cache
        let sessao = sessoesCache.buscarSessao(loginId, );

        if (sessao) {
            req.loginId = loginId;
            return next();
        }

        // 2️⃣ Buscar no banco de dados
        sessao = await sessoesModel.buscarSessao(loginId, token);

        if (!sessao) {
            return responses.error(res, {
                statusCode: 498,
                message: "Token de autenticação inválido"
            });
        }

        // 3️⃣ Verificar validade do token
        const validade = new Date(sessao.validade);
        const agora = new Date();

        if (validade < agora) {
            return responses.error(res, {
                statusCode: 498,
                message: "Token de autenticação expirou"
            });
        }

        // 4️⃣ Se expira em menos de 60 min → renova
        const minutosRestantes = (validade - agora) / 60000;

        if (minutosRestantes < 60) {
            const estendeu = await sessoesModel.extender(loginId, 24);
            if (estendeu) {
                console.log(`Token estendido por +24h (ID = ${loginId})`);
            }
        }

        // 5️⃣ Salvar no cache
        sessoesCache.addSessao(loginId, token);

        // 6️⃣ Disponibilizar loginId para as rotas
        req.loginId = loginId;

        return next();

    } catch (error) {
        return responses.error(res, {
            statusCode: 500,
            message: `Erro interno do servidor: ${error.message}`
        });
    }
}
