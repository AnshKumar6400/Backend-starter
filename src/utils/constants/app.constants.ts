import config from "@/config/app.config";

export const API_PREFIX = "/api/v1";

export const APPLICATION_ENV_TYPES = {
  PROD: "production",
  DEV: "development",
} as const;
export const SUCCESS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
}
export const API_ROUTES = {
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    REFRESH: "/refresh",
    LOGOUT: "/logout",
  },
} as const;
export const ERROR_CODES = {
  P2002: {
    code: "P2002",
    message: "Already exists",
  },
  E500:{
    code: "500",
    message: "Internal server error",
  },
  E401:{
    code: "401",
    message: "Unauthorized",
  },
  E404:{
    code: "404",
    message: "Not found",
  }
} as const;
 export const cookieOptions= {
      httpOnly: true,
      secure: config.JWT.COOKIE.SECURE === "true",
      sameSite: (config.JWT.COOKIE.SAME_SITE as "strict" | "lax" | "none") ?? "lax",
  }
