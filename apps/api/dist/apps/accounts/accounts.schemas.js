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
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordChangeSchema = exports.registrationSchema = exports.accountActivationSchema = void 0;
const z = __importStar(require("zod"));
exports.accountActivationSchema = z.object({
    email: z.string().email(),
});
exports.registrationSchema = z
    .object({
    username: z.string(),
    email: z.string().email("Invalid email"),
    password: z
        .string()
        .min(8, "An 8 charters password or more  is required")
        .max(20, "20 character is the max number of characters you can use in your password"),
    rePassword: z.string(),
})
    .refine((data) => data.password == data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
});
exports.passwordChangeSchema = z
    .object({
    oldPassword: z
        .string()
        .min(8, "An 8 charters password or more  is required")
        .max(20, "20 character is the max number of characters you can use in your password"),
    newPassword: z
        .string()
        .min(8, "An 8 charters password or more  is required")
        .max(20, "20 character is the max number of characters you can use in your password"),
    newPasswordConfirmation: z.string(),
})
    .refine((data) => data.newPassword == data.newPasswordConfirmation, {
    message: "Passwords don't match",
    path: ["newPasswordConfirmation"],
});
