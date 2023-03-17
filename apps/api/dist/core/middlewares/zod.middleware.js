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
exports.zodValidatorMiddleware = void 0;
const http_status_1 = __importDefault(require("http-status"));
const zodValidatorMiddleware = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const valid = yield schema.safeParseAsync(req.body);
    if (!valid.success) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "please make sure that you didn't miss any required field",
            errors: {
                fields: valid.error.formErrors.fieldErrors,
                form: valid.error.formErrors.formErrors,
            },
        });
    }
    return next();
});
exports.zodValidatorMiddleware = zodValidatorMiddleware;
