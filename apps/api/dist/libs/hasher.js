"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasher = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hasher = (password) => {
    return bcrypt_1.default.hashSync(password, 10);
};
exports.hasher = hasher;
