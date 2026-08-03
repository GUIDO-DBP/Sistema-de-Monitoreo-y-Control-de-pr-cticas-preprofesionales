import dotenv from 'dotenv';
import path from 'path';

// Load .env from the backend root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export const env = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '3001'), 10),
  DATABASE_URL: required('DATABASE_URL'),
  JWT_SECRET: optional('JWT_SECRET', 'dev-secret-must-change-in-production-32chars'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '8h'),
  BCRYPT_ROUNDS: parseInt(optional('BCRYPT_ROUNDS', '12'), 10),
  CORS_ORIGINS: optional(
    'CORS_ORIGINS',
    'http://localhost:8443,http://localhost:5173',
  ).split(',').map(o => o.trim()),
  UPLOAD_DIR: optional('UPLOAD_DIR', 'uploads'),
  MAX_FILE_SIZE_MB: parseInt(optional('MAX_FILE_SIZE_MB', '10'), 10),
  isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  },
  isProduction(): boolean {
    return this.NODE_ENV === 'production';
  },
} as const;
