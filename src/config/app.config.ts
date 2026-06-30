import "dotenv/config";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { APPLICATION_ENV_TYPES } from "@/utils/constants/app.constants";

export const config = {
  PORT: process.env.PORT || 5000,
  ENV: process.env.NODE_ENV,
  BASE_URL:
    process.env.NODE_ENV === APPLICATION_ENV_TYPES.DEV
      ? process.env.DEV_BASE_URL
      : process.env.PROD_BASE_URL,
  APPLICATION: {
    NAME: process.env.APPLICATION_NAME,
    VERSION: process.env.APPLICATION_VERSION,
  },
  FRONTEND_URL:
    process.env.NODE_ENV === APPLICATION_ENV_TYPES.DEV
      ? process.env.DEV_FRONTEND_URL
      : process.env.PROD_FRONTEND_URL,
  CORS: {
    ORIGIN:
      process.env.NODE_ENV === APPLICATION_ENV_TYPES.DEV
        ? process.env.CORS_DEV_ORIGIN
        : process.env.CORS_PROD_ORIGIN,
    CREDS: true,
  },
  SMTP: {
    HOST: process.env.SMTP_HOST as string,
    PORT: Number(process.env.SMTP_PORT) ,
    USER: process.env.SMTP_USER as string,
    PASS: process.env.SMTP_PASS as string,
  },
  JWT: {
    ACCESS_TOKEN: {
      SECRET: process.env.ACCESS_TOKEN_SECRET as string,
      EXPIRY: '1d' as const,
    },
    REFRESH_TOKEN: {
      SECRET: process.env.REFRESH_TOKEN_SECRET as string,
      EXPIRY: '7d' as const,
    },
    COOKIE: {
      ACCESS_MAX_AGE: process.env.ACCESS_TOKEN_COOKIE_MAX_AGE,
      REFRESH_MAX_AGE: process.env.REFRESH_TOKEN_COOKIE_MAX_AGE,
      SAME_SITE: process.env.COOKIE_SAME_SITE,
      SECURE: process.env.COOKIE_SECURE,
    },
  },
  RESET_TOKEN: {
    EXP_TIME: 3600000
  },

};

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

export default config;
