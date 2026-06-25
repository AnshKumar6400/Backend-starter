import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaClient } from '@/config/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export const config = {
  PORT: process.env.PORT || 5000,
  ENV: process.env.NODE_ENV,
  APPLICATION: {
    NAME: process.env.APPLICATION_NAME,
    VERSION: process.env.APPLICATION_VERSION,
  },
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN,
    CREDS: true,
  },
  JWT: {
    ACCESS_TOKEN: {
      SECRET: process.env.ACCESS_TOKEN_SECRET,
      EXPIRY: process.env.ACCESS_TOKEN_EXPIRES_IN,
    },
    REFRESH_TOKEN: {
      SECRET: process.env.REFRESH_TOKEN_SECRET,
      EXPIRY: process.env.REFRESH_TOKEN_EXPIRES_IN,
    },
    COOKIE: {
      ACCESS_MAX_AGE: process.env.ACCESS_TOKEN_COOKIE_MAX_AGE,
      REFRESH_MAX_AGE: process.env.REFRESH_TOKEN_COOKIE_MAX_AGE,
      SAME_SITE: process.env.COOKIE_SAME_SITE,
      SECURE: process.env.COOKIE_SECURE,
    },
  },
};

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

export default config;
