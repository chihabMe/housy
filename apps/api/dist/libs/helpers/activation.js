"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCanRequestAnotherTokenRedisKey = exports.prefixActivationToken = void 0;
const constants_1 = require("../../core/constants");
const prefixActivationToken = (token) => constants_1.ACTIVATION_TOKEN_PREFIX + token;
exports.prefixActivationToken = prefixActivationToken;
const generateCanRequestAnotherTokenRedisKey = (userId) => {
    return "requested-token-" + userId;
};
exports.generateCanRequestAnotherTokenRedisKey = generateCanRequestAnotherTokenRedisKey;
