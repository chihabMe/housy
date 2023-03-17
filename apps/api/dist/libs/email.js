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
exports.sendMail = exports.sendAccountActivationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("../core/env"));
const config = env_1.default.getEmailConfig();
const mailer = nodemailer_1.default.createTransport({
    host: config.host,
    port: config.port,
    secure: false,
    requireTLS: true,
    auth: {
        user: config.username,
        pass: config.password,
    },
});
const sendAccountActivationEmail = ({ to, subject, text, html, }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.sendMail)({ from: config.username, to, text, html, subject });
});
exports.sendAccountActivationEmail = sendAccountActivationEmail;
const sendMail = ({ to, from, subject, text, html, }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield mailer.sendMail({
        to,
        from,
        subject,
        text,
        html,
    });
});
exports.sendMail = sendMail;
// if (require.main == module)
//   );
