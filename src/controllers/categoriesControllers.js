// controllers/usuarioController.js
import * as Categorie  from '../models/categoriesModels.js';
import * as response from '../utils/response.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

function getEnterpriseId(req) {
    return req.enterprise?.id || req.user?.enterprise_id;
}

// GET ALL
export const getAllCategories = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const categories = await Categorie.getAllCategories(enterpriseId);

        return response.success(res, "Categories fetched successfully", categories);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// GET BY ID
export const getById = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { id } = req.params;

        const categorie = await Categorie.getById(id, enterpriseId);

        if (!categorie) {
            return response.notFound(res, "Categorie not found");
        }

        return response.success(res, "Categorie fetched successfully", categorie);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// GET BY NAME
export const getByName = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { name } = req.params;

        const categories = await Categorie.getByName(name, enterpriseId);

        return response.success(res, "Categories fetched successfully", categories);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// CREATE
export const createCategories = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const newCategorie = await Categorie.createCategories(req.body, enterpriseId);

        return response.created(res, "Categorie created successfully", newCategorie);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// UPDATE
export const updateCategories = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { id } = req.params;

        const updatedCategorie = await Categorie.updateCategories(id, req.body, enterpriseId);

        if (!updatedCategorie) {
            return response.notFound(res, "Categorie not found");
        }

        return response.updated(res, "Categorie updated successfully", updatedCategorie);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// DELETE
export const deleteCategories = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { id } = req.params;

        const deleted = await Categorie.deleteCategories(id, enterpriseId);

        if (!deleted) {
            return response.notFound(res, "Categorie not found");
        }

        return response.deleted(res, "Categorie deleted successfully");

    } catch (error) {
        return response.serverError(res, error);
    }
};