export function getEnterpriseId(req) {
    if (req.enterprise) return req.enterprise.id;
    if (req.user) return req.user.enterprise_id;
    return null;
}
