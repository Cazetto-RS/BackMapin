import * as responses from "../utils/response.js";

export function isEnterprise(req, res, next) {
    if (!req.enterprise) {
        return responses.error(res, {
            statusCode: 403,
            message: "Acesso permitido apenas para empresas"
        });
    }
    next();
}

export function isUser(req, res, next) {
    if (!req.user) {
        return responses.error(res, {
            statusCode: 403,
            message: "Acesso permitido apenas para usuários"
        });
    }
    next();
}

export function isEnterpriseOrAdmin(req, res, next) {
    if (req.enterprise) return next();

    if (req.user && req.user.nivel === "admin") return next();

    return responses.error(res, {
        statusCode: 403,
        message: "Apenas empresa ou usuário administrador podem acessar esta rota"
    });
}