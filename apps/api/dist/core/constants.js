"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTIVATION_TOKEN_PREFIX = exports.REQUEST_ANOTHER_ACTIVATION_TOKEN_TIME = exports.TOKEN_EXPIRES_TIME = exports.ACCESS_COOKIE_NAME = exports.REFRESH_COOKIE_NAME = exports.refreshTokenMaxAge = exports.accessTokenMaxAge = void 0;
exports.accessTokenMaxAge = 60 * 60 * 10; //10 mins;
exports.refreshTokenMaxAge = 60 * 60 * 24 * 25; // 25 days;
exports.REFRESH_COOKIE_NAME = "refresh";
exports.ACCESS_COOKIE_NAME = "authorization";
exports.TOKEN_EXPIRES_TIME = 60 * 60 * 10; //10 mins
exports.REQUEST_ANOTHER_ACTIVATION_TOKEN_TIME = 60 * 60 * 5; //5 mins
exports.ACTIVATION_TOKEN_PREFIX = "activation-token-";
