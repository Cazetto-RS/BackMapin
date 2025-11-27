// controllers/usuarioController.js
import * as User  from '../models/usersModels.js';
import * as response from '../utils/response.js';
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

export const getByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.getByEmail(email);

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
            return response.badRequest(res, "Email already in use");
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