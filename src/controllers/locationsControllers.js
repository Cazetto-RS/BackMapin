// controllers/usuarioController.js
import * as Products  from '../models/locationsModels.js';
import * as response from '../utils/response.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

function getEnterpriseId(req) {
    return req.enterprise?.id || req.user?.enterprise_id;
}

// GET ALL
export const getAllLocations = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const locations = await Products.getAllLocations(enterpriseId);

        return response.success(res, "Categories fetched successfully", locations);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// GET BY ID
export const getById = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { id } = req.params;

        const locations = await Products.getById(id, enterpriseId);

        if (!locations) {
            return response.notFound(res, "Products not found");
        }

        return response.success(res, "Products fetched successfully", locations);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// GET BY NAME
export const getByFilter = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { corredor, prateleira, setor, } = req.params;

        const locations = await Products.getByFilter(corredor, prateleira, setor, enterpriseId);

        return response.success(res, "Categories fetched successfully", locations);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// CREATE
export const createLocations = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const newLocations = await Products.createLocations(req.body, enterpriseId);

        return response.created(res, "Locations created successfully", newLocations);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// UPDATE
export const updateLocations = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { id } = req.params;

        const updatedLocations = await Products.updateLocations(id, req.body, enterpriseId);

        if (!updatedLocations) {
            return response.notFound(res, "Products not found");
        }

        return response.updated(res, "Products updated successfully", updatedLocations);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// DELETE
export const deleteLocations = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { id } = req.params;

        const deleted = await Locations.deleteLocations(id, enterpriseId);

        if (!deleted) {
            return response.notFound(res, "Locations not found");
        }

        return response.deleted(res, "Locations deleted successfully");

    } catch (error) {
        return response.serverError(res, error);
    }
};