import { Request, Response, NextFunction } from "express";
import { verifyJwtToken } from "@/utils/helpers/app.helpers";
import { CustomError } from "@/utils/errors/CustomError";
import { ERROR_CODES } from "@/utils/constants/app.constants";

/**
 * @desc    Verifies accessToken from cookies and attaches decoded payload to req.user
 * @param   {string} req.cookies.accessToken
 * @throws  CustomError 401 if token is missing or invalid
 */
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new CustomError(ERROR_CODES.E401.message, 401);
    }
    const payload = verifyJwtToken(token, "ACCESS");
    req.user = payload;
    next();
  } catch (e: any) {
    if (e instanceof CustomError) return next(e);
    next(new CustomError(ERROR_CODES.E401.message, 401));
  }
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateLogin = (email: string, password: string, next: NextFunction) => {
  try {
    if (!email || !password) {
      throw new CustomError("Email or Password is missing", 400);
    }
    if (!emailRegex.test(email)) {
      throw new CustomError("Invalid email format", 400);
    }
    if (!passwordRegex.test(password)) {
      throw new CustomError("Password must be 8+ chars with uppercase, lowercase, number and special character", 400);
    }
    next();
  } catch (e: any) {
    e instanceof CustomError ? next(e) : next(new CustomError("Invalid Input", 400));
  }
};

const validateRegister = (fullName: string, email: string, password: string, next: NextFunction) => {
  try {
    if (!fullName || !email || !password) {
      throw new CustomError("Full name, Email or Password is missing", 400);
    }
    if (!emailRegex.test(email)) {
      throw new CustomError("Invalid email format", 400);
    }
    if (!passwordRegex.test(password)) {
      throw new CustomError("Password must be 8+ chars with uppercase, lowercase, number and special character", 400);
    }
    next();
  } catch (e: any) {
    e instanceof CustomError ? next(e) : next(new CustomError("Invalid Input", 400));
  }
};

/**
 * @desc    Higher-order middleware that validates request body based on type
 * @param   {"LOGIN" | "REGISTER"} type
 * @returns Express middleware
 */
export const validateInput = (type: "LOGIN" | "REGISTER") => (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, password } = req.body ?? {};
    type === "LOGIN"
      ? validateLogin(email, password, next)
      : validateRegister(fullName, email, password, next);
  } catch (e: any) {
    next(new CustomError("Invalid Input", 400));
  }
};

export const validateResetPasswordInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body ?? {};
    if (!email) {
      throw new CustomError("Email is required", 400);
    }
    if (!emailRegex.test(email)) {
      throw new CustomError("Invalid email format", 400);
    }
    next();
  } catch (e: any) {
    e instanceof CustomError ? next(e) : next(new CustomError("Invalid Input", 400));
  }
};
