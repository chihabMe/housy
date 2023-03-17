"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.logoutTokenHandler = exports.verifyTokenHandler = exports.refreshTokenHandler = exports.obtainTokenHandler = void 0;
const http_status_1 = __importStar(require("http-status"));
const constants_1 = require("../../core/constants");
const redis_client_1 = __importDefault(require("../../core/redis_client"));
const auth_services_1 = require("./auth.services");
const bcrypt_1 = __importDefault(require("bcrypt"));
const accounts_interactors_1 = require("../accounts/accounts.interactors");
const jsonResponse_1 = __importDefault(require("../../libs/jsonResponse"));
const obtainTokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //extracts the email and the password from the body
    const { email, password } = req.body;
    try {
        //try to find a use with this email
        const user = yield (0, accounts_interactors_1.findUserByEmailInterector)(email);
        //if there is no use with this email
        // or
        // the entered password is not he same as that user password
        // return an 400 error with invalid credentials
        if (!user || !bcrypt_1.default.compareSync(password, user.password))
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                errors: {
                    fields: {
                        email: "invalid email",
                        password: "invalid password",
                    },
                    form: "please check your email and password and try again",
                },
            });
        if (!user.verified || !user.active)
            return res.status(http_status_1.BAD_REQUEST).json({
                success: false,
                errors: {
                    fields: {
                        email: "unverified email",
                    },
                    form: "you need to verify your email to activate your account please check your email box for the activation email if you didn't receive any emails you can request a new activation email ",
                },
            });
        // if the user credentials are valid
        // generate an access and refresh token
        const tokens = (0, auth_services_1.generateAuthTokens)(user.id);
        //store the refresh token in redis by using the user id as a key
        yield redis_client_1.default.set(user.id, tokens.refreshToken);
        //set the authentication headers for the response
        (0, auth_services_1.setAuthCookies)({
            res,
            access: tokens.accessToken,
            refresh: tokens.refreshToken,
        });
        //just fot testing
        if (process.env.MODE == "testing")
            return res.status(http_status_1.default.OK).json({
                success: true,
                tokens: {
                    refresh: `Bearer ${tokens.refreshToken}`,
                    access: `Bearer ${tokens.accessToken}`,
                },
                message: "you are logged in",
            });
        //return success response
        return res.status(http_status_1.default.OK).json({
            success: true,
            message: "you are logged in",
        });
    }
    catch (err) {
        //pass the error to the errors handler middleware
        next(err);
    }
});
exports.obtainTokenHandler = obtainTokenHandler;
//this  handler fun is responsible for refreshing the user access token and rotating the refresh token
//this handler func extracts  the refresh token from  the refresh header or the refresh cookie
// it will compare the received refresh token with the one stored in redis
// it  will generate a new access token and a new refresh token if they are the same
// it will store the refresh token in redis by using the user id as a key
// it will set new refresh/access cookies
const refreshTokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get the refresh token from the header or the cookie
    let refresh = (req.headers[constants_1.REFRESH_COOKIE_NAME] ||
        req.signedCookies[constants_1.REFRESH_COOKIE_NAME]);
    const decoded = (0, auth_services_1.validateRefreshToken)(refresh);
    //if decoded ==null return an error
    if (!decoded)
        return res.status(http_status_1.default.BAD_REQUEST).json(jsonResponse_1.default.error({
            message: "invalid refresh token",
            errors: {
                fields: {
                    refresh: ["Invalid"],
                },
            },
        }));
    //this try will handle if redis connection failed
    try {
        const token = refresh.split(" ")[1];
        //get the stored refresh token form redis
        const currentStoredRefreshToken = yield redis_client_1.default.get(decoded.user_id);
        //compare the relieved refresh token and the one stored in redis
        if (!currentStoredRefreshToken || token != currentStoredRefreshToken)
            //the refresh tokens are not the same thats mean the reviewed one is not whitelisted
            //return 400 bad request error and blacklisted token error
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                errors: {
                    fields: {
                        refresh: "blacklisted refresh token",
                    },
                },
            });
        //if the they are the same
        //generated new access/refresh tokens by using the decoded user_id
        let tokens;
        //to avoid generating the same token in the testing mode
        do {
            tokens = (0, auth_services_1.generateAuthTokens)(decoded.user_id);
        } while (tokens.refreshToken == currentStoredRefreshToken &&
            process.env.MODE == "testing");
        //store the new refresh token in redis by using the user_id as a key
        // await redis_client.set(decoded.user_id, tokens.refreshToken);
        yield redis_client_1.default.set(decoded.user_id, tokens.refreshToken);
        //set new signed cooked that contains  new a refresh token and a new access token
        (0, auth_services_1.setAuthCookies)({
            res,
            refresh: tokens.refreshToken,
            access: tokens.accessToken,
        });
        //just fot testing
        if (process.env.MODE == "testing")
            return res.status(http_status_1.default.OK).json({
                success: true,
                tokens: {
                    refresh: `Bearer ${tokens.refreshToken}`,
                    access: `Bearer ${tokens.accessToken}`,
                },
                message: "refreshed",
            });
        //return success
        return res
            .status(http_status_1.default.OK)
            .json({ success: true, message: "refreshed" });
    }
    catch (err) {
        //pass the error to the 500 handler middleware
        next(err);
    }
});
exports.refreshTokenHandler = refreshTokenHandler;
const verifyTokenHandler = (req, res) => {
    var _a;
    //get the access token from the header or the cookie
    const token = ((_a = req.headers[constants_1.ACCESS_COOKIE_NAME]) !== null && _a !== void 0 ? _a : req.signedCookies[constants_1.ACCESS_COOKIE_NAME]);
    //if there is no token or the token is invalid return 400 error invalid token
    if (!(0, auth_services_1.validateAccessToken)(token))
        return res.status(http_status_1.default.BAD_REQUEST).json("invalid access token");
    //else
    //return success status
    return res.status(http_status_1.default.OK).json();
};
exports.verifyTokenHandler = verifyTokenHandler;
const logoutTokenHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //get the refresh token from the header or the cookie
    const refresh = ((_a = req.headers[constants_1.REFRESH_COOKIE_NAME]) !== null && _a !== void 0 ? _a : req.signedCookies[constants_1.REFRESH_COOKIE_NAME]);
    //if there is no token or the token is invalid return 400 error invalid refresh token
    const decoded = (0, auth_services_1.validateRefreshToken)(refresh);
    if (!decoded)
        return res.status(http_status_1.default.BAD_REQUEST).json(jsonResponse_1.default.error({
            message: "invalid refresh token",
            errors: {
                refresh,
            },
        }));
    //if the refresh token is valid
    //delete it from redis by using the user_id as a key
    // await redis_client.del(decoded.user_id);
    yield redis_client_1.default.del(decoded.user_id);
    //delete the auth cookies
    res.clearCookie(constants_1.REFRESH_COOKIE_NAME);
    res.clearCookie(constants_1.ACCESS_COOKIE_NAME);
    //return a success response
    return res.status(http_status_1.default.OK).json("logged out");
});
exports.logoutTokenHandler = logoutTokenHandler;
