"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAuthCookiesFromHeaders = void 0;
const extractAuthCookiesFromHeaders = (headers) => {
    const cookies = headers["set-cookie"];
    const refresh = cookies[0].split(";")[0].split("=");
    const access = cookies[1].split(";")[0].split("=");
    return {
        refresh: refresh[1],
        access: access[1],
    };
};
exports.extractAuthCookiesFromHeaders = extractAuthCookiesFromHeaders;
