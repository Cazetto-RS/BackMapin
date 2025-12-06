// utils/response.js

export const success = (res, message = "Success", data = null, status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
};

export const error = (res, message = "Internal server error", status = 500) => {
    return res.status(status).json({
        success: false,
        message
    });
};

export const created = (res, message = "Created successfully", data = null) => {
    return res.status(201).json({
        success: true,
        message,
        data,
    });
};

export const updated = (res, message = "Updated successfully", data = null) => {
    return res.status(200).json({
        success: true,
        message,
        data,
    });
};

export const deleted = (res, message = "Deleted successfully") => {
    return res.status(200).json({
        success: true,
        message,
    });
};

export const notFound = (res, message = "Record not found") => {
    return res.status(404).json({
        success: false,
        message,
    });
};

export const badRequest = (res, message = "Invalid request") => {
    return res.status(400).json({
        success: false,
        message,
    });
};

export const unauthorized = (res, message = "Unauthorized") => {
    return res.status(401).json({
        success: false,
        message,
    });
};

export const forbidden = (res, message = "Access denied") => {
    return res.status(403).json({
        success: false,
        message,
    });
};

export const serverError = (res, error = null, message = "Internal server error") => {
    console.error("⚠️ ERROR:", error);

    return res.status(500).json({
        success: false,
        message,
        error: error?.message || error,
    });
};
