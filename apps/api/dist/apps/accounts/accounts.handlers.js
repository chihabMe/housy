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
exports.accountsUpdateProfileHandler = exports.generateAccountActivationEmailHandler = exports.accountsRestorePasswordHandler = exports.accountsChangeEmailHandler = exports.accountsChangePassword = exports.accountsActivateHandler = exports.accountsDeleteHandler = exports.accountsMeHandler = exports.accountsRegisterHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const hasher_1 = require("../../libs/hasher");
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../../libs/email");
const redis_client_1 = __importDefault(require("../../core/redis_client"));
const accounts_services_1 = require("./accounts.services");
const activation_1 = require("../../libs/helpers/activation");
const constants_1 = require("../../core/constants");
const accounts_interactors_1 = require("./accounts.interactors");
const jsonResponse_1 = __importDefault(require("../../libs/jsonResponse"));
const accountsRegisterHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //extracting the registration fields
    //(this route is being validated by zod validator middleware)
    //so those values are insured to be  stored in the req.body
    const { email, password, username } = req.body;
    try {
        //create a user and store it in the database
        const user = yield (0, accounts_interactors_1.createUserInteractor)({
            email,
            password: (0, hasher_1.hasher)(password),
            username,
        });
        //generate activation token
        const token = crypto_1.default.randomBytes(16).toString("hex");
        const activationToken = yield (0, accounts_interactors_1.createTokenInteractor)({
            token,
            userId: user.id,
            expiresAt: Date.now() + constants_1.TOKEN_EXPIRES_TIME,
        });
        //generate the activation uri
        // http(s)://..../activate/{token}
        const activationURI = (0, accounts_services_1.generateActivationURI)({
            host: (_a = req.headers.host) !== null && _a !== void 0 ? _a : "",
            token: activationToken.token,
        });
        console.log(activationURI);
        //send the token as a  confirmation email to the user
        try {
            yield (0, email_1.sendAccountActivationEmail)({
                subject: "account activation email",
                html: (0, accounts_services_1.generateActivationEmail)({ activationURI }),
                to: email,
            });
        }
        catch (err) { }
        //to store the use for asking many activation links in a short time
        yield (0, accounts_services_1.storeThatThisUserAskedForAToken)(user.id);
        //return success status and the user data
        res.status(http_status_1.default.CREATED).json(jsonResponse_1.default.success({
            message: "please check your email for the activation link",
        }));
    }
    catch (err) {
        //pass the error to the 500 errors handler middleware
        next(err);
    }
});
exports.accountsRegisterHandler = accountsRegisterHandler;
const accountsMeHandler = (req, res) => {
    //@ts-ignore
    const user = Object.assign({}, req.user);
    const { createdAt, email, id, updatedAt, username } = user;
    res.status(http_status_1.default.OK).json(jsonResponse_1.default.success({
        message: "user data",
        data: { username, id, updatedAt, createdAt, email },
    }));
};
exports.accountsMeHandler = accountsMeHandler;
const accountsDeleteHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const user = req.user;
        yield (0, accounts_interactors_1.updateUserInteractor)({
            userId: user.id,
            active: false,
        });
        //delete the stored refresh token from redis
        yield redis_client_1.default.del(user.id);
        //delete the  authentication cookies
        res.clearCookie(constants_1.REFRESH_COOKIE_NAME);
        res.clearCookie(constants_1.ACCESS_COOKIE_NAME);
        res.status(http_status_1.default.OK).json(jsonResponse_1.default.success({ message: "deleted" }));
    }
    catch (err) {
        next(err);
    }
});
exports.accountsDeleteHandler = accountsDeleteHandler;
const accountsActivateHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get the activation token from the params
    const activationToken = req.params.token;
    //if the activationToken is null return 400 error with message
    if (!activationToken)
        return res
            .status(http_status_1.default.BAD_REQUEST)
            .json(jsonResponse_1.default.error({ message: "invalid token" }));
    try {
        //get the user by using the activation token
        const token = yield (0, accounts_interactors_1.findTokenByToken)(activationToken);
        if (!token)
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json(jsonResponse_1.default.error({ message: "invalid token" }));
        if (Date.now() > token.expiresAt)
            res
                .status(http_status_1.default.BAD_REQUEST)
                .json(jsonResponse_1.default.error({ message: "dead token token" }));
        //update the user to be active and verified
        yield (0, accounts_interactors_1.updateUserInteractor)({
            userId: token.userId,
            active: true,
            verified: true,
        });
        //delete the activationToken
        yield (0, accounts_interactors_1.deleteTokenById)(token.id);
        //return success response
        return res
            .status(http_status_1.default.OK)
            .json(jsonResponse_1.default.success({ message: "activated" }));
    }
    catch (err) {
        next(err);
    }
});
exports.accountsActivateHandler = accountsActivateHandler;
const accountsChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    //@ts-ignore
    const user = req.user;
    //validate the entered password and the user password
    if (!(0, accounts_services_1.compareUserPassword)({ password: oldPassword, hash: user.password }))
        return res.status(http_status_1.default.BAD_REQUEST).json(jsonResponse_1.default.error({
            message: "invalid credentials",
            errors: {
                oldPassword: ["Invalid"],
            },
        }));
    //update the user with the hash of the new password
    yield (0, accounts_interactors_1.updateUserInteractor)({
        userId: user.id,
        password: (0, hasher_1.hasher)(newPassword),
    });
    //return success response
    res.status(http_status_1.default.OK).json(jsonResponse_1.default.success({
        message: "your password has been changed",
    }));
});
exports.accountsChangePassword = accountsChangePassword;
const accountsChangeEmailHandler = (req, res) => {
    res.status(http_status_1.default.OK).json("change email");
};
exports.accountsChangeEmailHandler = accountsChangeEmailHandler;
const accountsRestorePasswordHandler = (req, res) => {
    res.status(http_status_1.default.OK).json("restore password");
};
exports.accountsRestorePasswordHandler = accountsRestorePasswordHandler;
const generateAccountActivationEmailHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const email = req.body.email;
        const user = yield (0, accounts_interactors_1.findUserByEmailInterector)(email);
        //to protect the api from exposing the registered users
        //i will alway return a success response
        if (!user || user.active)
            return res.status(200).json(jsonResponse_1.default.success({
                message: "please check your email for the activation link",
            }));
        const canGenerateAnotherToken = yield redis_client_1.default.get((0, activation_1.generateCanRequestAnotherTokenRedisKey)(user.id));
        const lastGeneratedToken = yield (0, accounts_interactors_1.getLastGeneratedTokenFromAUser)(user.id);
        let now = new Date().getTime();
        if (now - lastGeneratedToken.createdAt.getTime() < constants_1.TOKEN_EXPIRES_TIME)
            return res.status(http_status_1.default.BAD_REQUEST).json(jsonResponse_1.default.error({
                message: "you asked for an email before please wait 15 mins and try that again",
            }));
        //generate a token for the  user to activate his email
        const activationToken = yield (0, accounts_interactors_1.createTokenInteractor)({
            expiresAt: Date.now() + constants_1.TOKEN_EXPIRES_TIME,
            token: crypto_1.default.randomBytes(16).toString("hex"),
            userId: user.id,
        });
        //generate an activation uri that contains the generated token
        // http(s)://..../activate/{token}
        const activationURI = (0, accounts_services_1.generateActivationURI)({
            host: (_b = req.headers.host) !== null && _b !== void 0 ? _b : "",
            token: activationToken.token,
        });
        console.log(activationURI);
        try {
            //send the token as a  confirmation email to the user
            yield (0, email_1.sendAccountActivationEmail)({
                subject: "account activation email",
                html: (0, accounts_services_1.generateActivationEmail)({ activationURI }),
                to: user.email,
            });
        }
        catch (err) { }
        res.status(http_status_1.default.OK).json(jsonResponse_1.default.success({
            message: "please check your email for the activation link",
        }));
    }
    catch (err) {
        next(err);
    }
});
exports.generateAccountActivationEmailHandler = generateAccountActivationEmailHandler;
const accountsUpdateProfileHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.user;
    const { username } = req.body;
    const updatedUser = yield (0, accounts_interactors_1.updateUserInteractor)({
        userId: user.id,
        username,
    });
    res.status(http_status_1.default.OK).json(jsonResponse_1.default.success({
        message: "updated",
        data: {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
        },
    }));
});
exports.accountsUpdateProfileHandler = accountsUpdateProfileHandler;
