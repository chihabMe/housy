"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const _404 = (req, res, next) => {
    res.sendStatus(http_status_1.default.NOT_FOUND);
};
exports.default = _404;
