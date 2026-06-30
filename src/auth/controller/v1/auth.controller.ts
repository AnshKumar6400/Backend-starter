import { Request, Response, NextFunction } from "express";
import { AuthService } from "@/auth/services/v1/auth.service";
import { config } from "@/config/app.config";
import { cookieOptions, SUCCESS_CODES } from "@/utils/constants/app.constants";
import { ApiResponse } from "@/utils/response/APIResponse";
import { CustomError } from "@/utils/errors/CustomError";

export class AuthController {
  /**
   * @route   POST /api/v1/auth/register
   * @access  Public
   * @param   {string} req.body.fullName
   * @param   {string} req.body.email
   * @param   {string} req.body.password
   * @returns User object without password
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, password } = req.body;
      const user = await AuthService.register(fullName, email, password);
      const { password: _, ...userWithoutPassword } = user;
      ApiResponse.success(res, userWithoutPassword, "Registration Successful", SUCCESS_CODES.CREATED);
    } catch (e: any) {
      next(e);
    }
  }

  /**
   * @route   POST /api/v1/auth/login
   * @access  Public
   * @param   {string} req.body.email
   * @param   {string} req.body.password
   * @returns Sets accessToken + refreshToken as HTTP-only cookies
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await AuthService.login(email, password);

      res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: Number(config.JWT.COOKIE.ACCESS_MAX_AGE),
      });
      res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: Number(config.JWT.COOKIE.REFRESH_MAX_AGE),
      });

      ApiResponse.success(res, null, "Login Successful", SUCCESS_CODES.SUCCESS);
    } catch (e: any) {
      next(e);
    }
  }

  /**
   * @route   POST /api/v1/auth/refresh
   * @access  Public
   * @param   {string} req.cookies.refreshToken
   * @returns Sets new accessToken as HTTP-only cookie
   */
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new CustomError("No refresh token provided", 401);
      }
      const { accessToken } = await AuthService.refresh(refreshToken);
      res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: Number(config.JWT.COOKIE.ACCESS_MAX_AGE),
      });
      ApiResponse.success(res, null, "Token refreshed", SUCCESS_CODES.SUCCESS);
    } catch (e: any) {
      next(e);
    }
  }

  /**
   * @route   POST /api/v1/auth/logout
   * @access  Private
   * @param   {JwtPayload} req.user - Attached by validateToken middleware
   * @returns Clears accessToken + refreshToken cookies
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      ApiResponse.success(res, null, "Logout Successful", SUCCESS_CODES.SUCCESS);
    } catch (e: any) {
      next(e);
    }
  }
}