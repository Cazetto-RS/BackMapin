// controllers/usuarioController.js
import * as Products  from '../models/productsModels.js';
import * as response from '../utils/response.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

function getEnterpriseId(req) {
    return req.enterprise?.id || req.user?.enterprise_id;
}

// GET ALL
export const getAllProducts = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const products = await Products.getAllProducts(enterpriseId);

        return response.success(res, "Categories fetched successfully", products);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// GET BY ID
export const getById = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { id } = req.params;

        const products = await Products.getById(id, enterpriseId);

        if (!products) {
            return response.notFound(res, "Products not found");
        }

        return response.success(res, "Products fetched successfully", products);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// GET BY NAME
export const getByName = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { name } = req.params;

        const products = await Products.getByName(name, enterpriseId);

        return response.success(res, "Categories fetched successfully", products);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// CREATE
export const createProducts = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const newProduct = await Products.createProducts(req.body, enterpriseId);

        return response.created(res, "Products created successfully", newProduct);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// UPDATE
export const updateProducts = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { id } = req.params;

        const updatedProduct = await Products.updateProducts(id, req.body, enterpriseId);

        if (!updatedProduct) {
            return response.notFound(res, "Products not found");
        }

        return response.updated(res, "Products updated successfully", updatedProduct);

    } catch (error) {
        return response.serverError(res, error);
    }
};

// DELETE
export const deleteProducts = async (req, res) => {
    try {
        const enterpriseId = getEnterpriseId(req);
        const { id } = req.params;

        const deleted = await Products.deleteProducts(id, enterpriseId);

        if (!deleted) {
            return response.notFound(res, "Products not found");
        }

        return response.deleted(res, "Products deleted successfully");

    } catch (error) {
        return response.serverError(res, error);
    }
};