import * as service from "../services/crudService.js";
import { sendPayloadResponse } from "../utils/responsePayload.js";

// INSERT
const crudInsert = async (req, res) => {
    const { tableName, successMessage, errorMessage, ...data } = req.body;
    if (!tableName) {
        return sendPayloadResponse(res, {
            statusCode: 400,
            success: false,
            message: "tableName is required",
        });
    }

    try {
        const insertedData = await service.crudInsert({ tableName, ...data });
        return sendPayloadResponse(res, {
            statusCode: 201,
            success: true,
            message: successMessage,
            data: { insertedData },
        });
    } catch (error) {
        return sendPayloadResponse(res, {
            statusCode: 500,
            success: false,
            message: `${errorMessage ? errorMessage + ' : ' : 'Error: '}${error.message}`,
        });
    }
};

// READ
const crudRead = async (req, res) => {
    const { tableName, query = {}, successMessage, errorMessage } = req.body;
    if (!tableName) {
        return sendPayloadResponse(res, {
            statusCode: 400,
            success: false,
            message: "tableName is required",
        });
    }

    try {
        const data = await service.crudRead({ tableName, query });
        return sendPayloadResponse(res, {
            statusCode: 200,
            success: true,
            message: successMessage,
            data,
        });
    } catch (error) {
        return sendPayloadResponse(res, {
            statusCode: 500,
            success: false,
            message: `${errorMessage ? errorMessage + ' : ' : 'Error: '}${error.message}`,
        });
    }
};

// UPDATE
const crudUpdate = async (req, res) => {
    const { tableName, query = {}, updateData, successMessage, errorMessage } = req.body;
    if (!tableName) {
        return sendPayloadResponse(res, {
            statusCode: 400,
            success: false,
            message: "tableName is required",
        });
    }

    try {
        const updated = await service.crudUpdate({ tableName, query, updateData });
        return sendPayloadResponse(res, {
            statusCode: 200,
            success: true,
            message: successMessage,
            data: { updated },
        });
    } catch (error) {
        return sendPayloadResponse(res, {
            statusCode: 500,
            success: false,
            message: `${errorMessage ? errorMessage + ' : ' : 'Error: '}${error.message}`,
        });
    }
};

// DELETE
const crudDelete = async (req, res) => {
    const { tableName, query = {}, successMessage, errorMessage } = req.body;
    if (!tableName) {
        return sendPayloadResponse(res, {
            statusCode: 400,
            success: false,
            message: "tableName is required",
        });
    }

    try {
        const deleted = await service.crudDelete({ tableName, query });
        return sendPayloadResponse(res, {
            statusCode: 200,
            success: true,
            message: successMessage,
            data: { deleted },
        });
    } catch (error) {
        return sendPayloadResponse(res, {
            statusCode: 500,
            success: false,
            message: `${errorMessage ? errorMessage + ' : ' : 'Error: '}${error.message}`,
        });
    }
};

export { crudInsert, crudRead, crudUpdate, crudDelete };
