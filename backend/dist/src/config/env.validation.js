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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.envValidationSchema = void 0;
const Joi = __importStar(require("joi"));
exports.envValidationSchema = Joi.object({
    DATABASE_URL: Joi.string().required().messages({
        'string.empty': 'DATABASE_URL is required',
        'any.required': 'DATABASE_URL is required',
    }),
    JWT_SECRET: Joi.string().required().min(32).messages({
        'string.empty': 'JWT_SECRET is required',
        'string.min': 'JWT_SECRET must be at least 32 characters long',
        'any.required': 'JWT_SECRET is required',
    }),
    JWT_EXPIRES_IN: Joi.string().default('15m'),
    JWT_REFRESH_SECRET: Joi.string().required().min(32).messages({
        'string.empty': 'JWT_REFRESH_SECRET is required',
        'string.min': 'JWT_REFRESH_SECRET must be at least 32 characters long',
        'any.required': 'JWT_REFRESH_SECRET is required',
    }),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    TAX_RATE: Joi.number().min(0).max(1).default(0.14),
    CLOUDINARY_CLOUD_NAME: Joi.string().required().messages({
        'string.empty': 'CLOUDINARY_CLOUD_NAME is required',
        'any.required': 'CLOUDINARY_CLOUD_NAME is required',
    }),
    CLOUDINARY_API_KEY: Joi.string().required().messages({
        'string.empty': 'CLOUDINARY_API_KEY is required',
        'any.required': 'CLOUDINARY_API_KEY is required',
    }),
    CLOUDINARY_API_SECRET: Joi.string().required().messages({
        'string.empty': 'CLOUDINARY_API_SECRET is required',
        'any.required': 'CLOUDINARY_API_SECRET is required',
    }),
    PAYMOB_API_KEY: Joi.string().optional().allow(''),
    PAYMOB_INTEGRATION_ID: Joi.string().optional().allow(''),
    PAYMOB_HMAC_SECRET: Joi.string().optional().allow(''),
    EMAIL_HOST: Joi.string().required().messages({
        'string.empty': 'EMAIL_HOST is required',
        'any.required': 'EMAIL_HOST is required',
    }),
    EMAIL_PORT: Joi.number().default(587),
    EMAIL_USER: Joi.string().email().required().messages({
        'string.empty': 'EMAIL_USER is required',
        'string.email': 'EMAIL_USER must be a valid email address',
        'any.required': 'EMAIL_USER is required',
    }),
    EMAIL_PASS: Joi.string().required().messages({
        'string.empty': 'EMAIL_PASS is required',
        'any.required': 'EMAIL_PASS is required',
    }),
    EMAIL_FROM: Joi.string().email().default('noreply@yoursupermarket.com'),
    FRONTEND_URL: Joi.string().uri().default('http://localhost:3001'),
});
//# sourceMappingURL=env.validation.js.map