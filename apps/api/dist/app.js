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
const env_1 = __importDefault(require("./core/env"));
const redis_client_1 = require("./core/redis_client");
const server_1 = require("./utils/server");
const runServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, server_1.createServer)();
    yield (0, redis_client_1.redis_client_connect)();
    app.listen(env_1.default.PORT, () => {
        console.log(`running the server on port ${env_1.default.PORT}`);
    });
    return app;
});
// if (require.main == module) runServer();
exports.default = runServer();
