import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Database
  DATABASE_URL: Joi.string().required().messages({
    'string.empty': 'DATABASE_URL is required',
    'any.required': 'DATABASE_URL is required',
  }),

  // JWT Configuration
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

  // Application
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  TAX_RATE: Joi.number().min(0).max(1).default(0.14),

  // Cloudinary
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

  // Paymob
  PAYMOB_API_KEY: Joi.string().optional().allow(''),
  PAYMOB_INTEGRATION_ID: Joi.string().optional().allow(''),
  PAYMOB_HMAC_SECRET: Joi.string().optional().allow(''),

  // Email (Nodemailer)
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

  // CORS
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3001'),
});
