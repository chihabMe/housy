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
const http_status_1 = __importDefault(require("http-status"));
const auth_services_1 = require("../../apps/auth/auth.services");
const jsonResponse_1 = __importDefault(require("../../libs/jsonResponse"));
const constants_1 = require("../constants");
const prisma_1 = __importDefault(require("../prisma"));
const protectedRouteMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let access = (_a = req.signedCookies[constants_1.ACCESS_COOKIE_NAME]) !== null && _a !== void 0 ? _a : req.headers[constants_1.ACCESS_COOKIE_NAME];
    const decoded = (0, auth_services_1.validateAccessToken)(access);
    if (!decoded)
        return res.status(http_status_1.default.UNAUTHORIZED).json(jsonResponse_1.default.error({
            message: `an ${constants_1.ACCESS_COOKIE_NAME} token cookie or header is required `,
            errors: {
                refresh: "Required",
            },
        }));
    try {
        const user = yield prisma_1.default.user.findFirst({
            where: {
                id: decoded.user_id,
            },
        });
        if (!user)
            return res.sendStatus(http_status_1.default.UNAUTHORIZED);
        //@ts-ignore
        req.user = user;
    }
    catch (err) {
        next(err);
    }
    next();
});
exports.default = protectedRouteMiddleware;
