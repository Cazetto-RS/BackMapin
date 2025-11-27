// controllers/usuarioController.js
import * as Categorie  from '../models/categoriesModels.js';
import * as response from '../utils/response.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';


export const getAllCategories = async (req, res) => {
    try {
        const categories = await Categorie.getAllCategories();

        return response.success(res, "Users fetched successfully", categories);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        const categorie = await Categorie.getById(id);

        if (!categorie) {
            return response.notFound(res, "Categorie not found");
        }

        return response.success(res, "Categorie fetched successfully", categorie);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const getByName = async (req, res) => {
    try {
        const { name } = req.params;

        const categorie = await Categorie.getByName(name);

        if (!categorie) {
            return response.notFound(res, "Categorie not found");
        }

        return response.success(res, "Categorie fetched successfully", categorie);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const createCategories = async (req, res) => {
    try {
        const newCategorie = await Categorie.createCategories(req.body);

        return response.created(res, "User created successfully", newCategorie);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const updateCategories = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedCategorie = await Categorie.updateCategories(id, req.body);

        if (!updatedCategorie) {
            return response.notFound(res, "Categorie not found");
        }

        return response.updated(res, "Categorie updated successfully", updatedCategorie);

    } catch (error) {
        return response.serverError(res, error);
    }
};

export const deleteCategories = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Categorie.deleteCategories(id);

        if (!deleted) {
            return response.notFound(res, "Categorie not found");
        }

        return response.deleted(res, "Categorie deleted successfully");

    } catch (error) {
        return response.serverError(res, error);
    }
};