"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateTheActivationToken = exports.getUserIdFromRedisUsingTheActionToken = exports.compareUserPassword = exports.generateActivationEmail = exports.generateActivationURI = exports.storeThatThisUserAskedForAToken = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../../core/constants");
const env_1 = __importDefault(require("../../core/env"));
const redis_client_1 = __importDefault(require("../../core/redis_client"));
const activation_1 = require("../../libs/helpers/activation");
const storeThatThisUserAskedForAToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_client_1.default.set((0, activation_1.generateCanRequestAnotherTokenRedisKey)(userId), 1, {
        EX: constants_1.REQUEST_ANOTHER_ACTIVATION_TOKEN_TIME,
    });
});
exports.storeThatThisUserAskedForAToken = storeThatThisUserAskedForAToken;
const generateActivationURI = ({ token, host, }) => {
    return `${env_1.default.isProduction() ? "https" : "http"}://${host}/api/v1/accounts/activate/${token}`;
};
exports.generateActivationURI = generateActivationURI;
const generateActivationEmail = ({ activationURI, }) => {
    return `
    <a href=${activationURI}>
    ${activationURI}
    </a>
    `;
};
exports.generateActivationEmail = generateActivationEmail;
const compareUserPassword = ({ password, hash, }) => {
    return bcrypt_1.default.compareSync(password, hash);
};
exports.compareUserPassword = compareUserPassword;
//this function will
//get the userId from redis by using the activation as key
const getUserIdFromRedisUsingTheActionToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redis_client_1.default.get((0, activation_1.prefixActivationToken)(token));
});
exports.getUserIdFromRedisUsingTheActionToken = getUserIdFromRedisUsingTheActionToken;
//this function will
//delete the activationToken from redis
const invalidateTheActivationToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return redis_client_1.default.del((0, activation_1.prefixActivationToken)(token));
});
exports.invalidateTheActivationToken = invalidateTheActivationToken;
