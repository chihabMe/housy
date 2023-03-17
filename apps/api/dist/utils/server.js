"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const accounts_routes_1 = require("../apps/accounts/accounts.routes");
const auth_routes_1 = require("../apps/auth/auth.routes");
const env_1 = __importDefault(require("../core/env"));
const _404_middleware_1 = __importDefault(require("../core/middlewares/404.middleware"));
const _500_middleware_1 = __importDefault(require("../core/middlewares/500.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const createServer = () => {
    const app = (0, express_1.default)();
    registerMiddlewares(app);
    app.get("api/v1/hello", (req, res) => {
        res.json("hello world");
    });
    registerApps(app);
    registerErrorsMiddlewares(app);
    return app;
};
exports.createServer = createServer;
const registerApps = (app) => {
    app.get("/api/v1/hello", (req, res) => res.status(200).json("hello world"));
    app.use("/api/v1/auth", auth_routes_1.authRouter);
    app.use("/api/v1/accounts", accounts_routes_1.accountsRouter);
};
const registerMiddlewares = (app) => {
    app.use((0, morgan_1.default)("dev"));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)(env_1.default.getCookieSecretKey()));
};
const registerErrorsMiddlewares = (app) => {
    app.use(_404_middleware_1.default);
    app.use(_500_middleware_1.default);
};
