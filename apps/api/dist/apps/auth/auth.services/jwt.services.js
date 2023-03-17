"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRefreshToken = exports.validateAccessToken = exports.generateAuthTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../../../core/constants");
const env_1 = __importDefault(require("../../../core/env"));
const generateAuthTokens = (user_id) => {
    const accessToken = jsonwebtoken_1.default.sign({ user_id }, env_1.default.getAccessSecret(), {
        expiresIn: constants_1.accessTokenMaxAge,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ user_id }, env_1.default.getRefreshTokenSecret(), {
        expiresIn: constants_1.refreshTokenMaxAge,
    });
    return { accessToken, refreshToken };
};
exports.generateAuthTokens = generateAuthTokens;
const validateAccessToken = (token) => {
    if (!token)
        return null;
    token = token.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.getAccessSecret());
        return decoded;
    }
    catch (_a) {
        return null;
    }
};
exports.validateAccessToken = validateAccessToken;
const validateRefreshToken = (token) => {
    if (!token)
        return null;
    token = token.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.getRefreshTokenSecret());
        return decoded;
    }
    catch (err) {
        return null;
    }
};
exports.validateRefreshToken = validateRefreshToken;
