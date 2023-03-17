"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const _500 = (err, req, res, next) => {
    console.error(err);
    res.sendStatus(http_status_1.default.INTERNAL_SERVER_ERROR);
    // res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
};
exports.default = _500;
