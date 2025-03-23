// utils/responsePayload.js
export class ResponsePayload {
    constructor({ statusCode = 200, success = true, message = "", data = null }) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
    }
}

export const sendPayloadResponse = (res, { statusCode = 200, success = true, message = "", data = null }) => {
    const response = new ResponsePayload({ statusCode, success, message, data });
    return res.status(statusCode).json(response);
};

