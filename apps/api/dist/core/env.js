"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisURL = exports.getCookieSecretKey = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3001;
const getCookieSecretKey = () => {
    const secret = process.env.COOKIE_SECRET;
    if (!secret)
        throw new Error("please provide a COOKIE_SECRET as env variable");
    return secret;
};
exports.getCookieSecretKey = getCookieSecretKey;
const isProduction = () => {
    return process.env.MODE == "PRODUCTION";
};
const getRefreshTokenSecret = () => {
    const secret = process.env.REFRESH_SECRET;
    if (!secret)
        throw new Error("please provide a REFRESH_SECRET as env variable");
    return secret;
};
const getAccessSecret = () => {
    const secret = process.env.REFRESH_SECRET;
    if (!secret)
        throw new Error("please provide a ACCESS_SECRET as env variable");
    return secret;
};
const getRedisURL = () => {
    const host = process.env.REDIS_HOST;
    const port = process.env.REDIS_PORT;
    const password = process.env.REDIS_PASSWORD;
    const username = process.env.REDIS_USERNAME;
    if (!isProduction())
        return `redis://:@localhost:6379`;
    if (!host || !port || !password || !username)
        throw new Error("please check your redis env variables");
    return `redis://${username}:${password}@${host}:${port}`;
};
exports.getRedisURL = getRedisURL;
const getEmailConfig = () => {
    const host = process.env.EMAIL_HOST;
    const username = process.env.EMAIL_USERNAME;
    const port = process.env.EMAIL_PORT;
    const password = process.env.EMAIL_SECRET;
    if (!host || !password || !port || !username)
        throw new Error("please check your email env variables");
    return {
        host,
        password,
        username,
        port: Number.parseInt(port),
    };
};
exports.default = {
    PORT,
    isProduction,
    getRefreshTokenSecret,
    getAccessSecret,
    getCookieSecretKey: exports.getCookieSecretKey,
    getRedisURL: exports.getRedisURL,
    getEmailConfig,
};
