import { prisma } from "@/config/app.config";
import { User } from "@/generated/prisma/client";
import {
  hashPassword,
  comparePassword,
  generateJwtToken,
  verifyJwtToken,
  generateResetToken,
  hashToken,
} from "@/utils/helpers/app.helpers";
import { findByEmail, findByEmailWithResetToken } from "@/utils/helpers/db.helpers";
import { ERROR_CODES } from "@/utils/constants/app.constants";
import { CustomError } from "@/utils/errors/CustomError";
import config from "@/config/app.config";
export class AuthService {
  /**
   * @param {string} fullName
   * @param {string} email
   * @param {string} password
   * @returns Promise<User>
   */
  static async register(
    fullName: string,
    email: string,
    password: string,
  ): Promise<User> {
    try {
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: fullName,
          isActive: true,
          isDeleted: false,
        },
      });
      return user;
    } catch (e: any) {
      if (e.code === ERROR_CODES.P2002.code) {
        throw new CustomError(ERROR_CODES.P2002.message, 409);
      }
      throw new CustomError(e.message, 500);
    }
  }

  /**
   * @param {string} email
   * @param {string} password
   * @returns Promise<{ accessToken, refreshToken }>
   */
  static async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await findByEmail(email);
      if (!user) {
        throw new CustomError(ERROR_CODES.E404.message, 404);
      }
      if (!(await comparePassword(password, user.password))) {
        throw new CustomError(ERROR_CODES.E401.message, 401);
      }
      const accessToken = generateJwtToken(
        { id: user.id, email: user.email },
        "ACCESS",
      );
      const refreshToken = generateJwtToken(
        { id: user.id, email: user.email },
        "REFRESH",
      );
      return { accessToken, refreshToken };
    } catch (e: any) {
      if (e instanceof CustomError) throw e;
      throw new CustomError(e.message, 500);
    }
  }

  /**
   * @param {string} refreshToken
   * @returns Promise<{ accessToken }>
   */
  static async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = verifyJwtToken(refreshToken, "REFRESH");
      const accessToken = generateJwtToken(
        { id: payload.id, email: payload.email },
        "ACCESS",
      );
      return { accessToken };
    } catch (e: any) {
      throw new CustomError(ERROR_CODES.E401.message, 401);
    }
  }
  static async resetPassword(email: string) {
    const user = await findByEmailWithResetToken(email);
    if (!user) {
      throw new CustomError(ERROR_CODES.E404.message, 404);
    }
    if (!user.isActive) {
      throw new CustomError(ERROR_CODES.E403.message, 403);
    }
    const newResetToken = await generateResetToken(email);
    const hashedToken = await hashToken(newResetToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken, resetTokenExpiresAt: new Date(Date.now() + config.RESET_TOKEN.EXP_TIME) },
    })
    

  }
}

