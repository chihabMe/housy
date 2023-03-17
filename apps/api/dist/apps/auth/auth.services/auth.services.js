"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookies = void 0;
const constants_1 = require("../../../core/constants");
const env_1 = __importDefault(require("../../../core/env"));
const basicCookieOptions = {
    httpOnly: true,
    path: "/",
    secure: env_1.default.isProduction(),
    sameSite: env_1.default.isProduction() ? "strict" : "lax",
    signed: true,
};
const refreshCookieOptions = Object.assign({ maxAge: constants_1.refreshTokenMaxAge * 1000 }, basicCookieOptions);
const accessCookieOptions = Object.assign({ maxAge: constants_1.accessTokenMaxAge * 1000 }, basicCookieOptions);
const setAuthCookies = ({ res, refresh, access, }) => {
    //@ts-ignore
    res.cookie(constants_1.REFRESH_COOKIE_NAME, `Bearer ${refresh}`, refreshCookieOptions);
    //@ts-ignore
    res.cookie(constants_1.ACCESS_COOKIE_NAME, `Bearer ${access}`, accessCookieOptions);
};
exports.setAuthCookies = setAuthCookies;
