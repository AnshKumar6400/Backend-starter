export const APPLICATION_ENV_TYPES = {
  PROD: "production",
  DEV: "development",
} as const;

export const ERROR_CODES = {
  P2002: {
    code: "2002",
    message: "Already exists",
  },
  E500:{
    code: "500",
    message: "Internal server error",
  },
  E401:{
    code: "401",
    message: "Not Found",
  },
  E404:{
    code: "404",
    message: "Not found",
  }
} as const;
