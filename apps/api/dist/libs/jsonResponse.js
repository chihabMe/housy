"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonRepose = {
    success: ({ message, data }) => {
        return {
            success: true,
            message,
            data,
        };
    },
    error: ({ errors, message }) => {
        return {
            success: false,
            message,
            errors,
        };
    },
};
exports.default = jsonRepose;
