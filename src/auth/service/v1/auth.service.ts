import { prisma } from "@/config/app.config";
import { User } from "@/generated/prisma/client";
import {
  hashPassword,
  comparePassword,
  generateJwtToken,
  verifyJwtToken,
  generateResetToken,
  generateHashToken,
} from "@/utils/helpers/app.helpers";
import { findByEmail, findByEmailWithResetToken } from "@/utils/helpers/db.helpers";
import { ERROR_CODES } from "@/utils/constants/app.constants";
import { CustomError } from "@/utils/errors/CustomError";
import config from "@/config/app.config";
import { sendResetPasswordEmail } from "@/utils/helpers/mail.helpers";
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
  static async resetPassword(email: string): Promise<void> {
    try {
      const user = await findByEmailWithResetToken(email);
      // Return silently when user not found or inactive — prevents email enumeration
      if (!user || !user.isActive) return;
      const newResetToken = await generateResetToken(email);
      const hashedToken = await generateHashToken(newResetToken);
      // Send email first; only persist token if email succeeds
      await sendResetPasswordEmail(email, newResetToken);
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: hashedToken, resetTokenExpiresAt: new Date(Date.now() + config.RESET_TOKEN.EXP_TIME) },
      });
    } catch (e: any) {
      throw e instanceof CustomError ? e : new CustomError(e.message, 500);
    }
  }
  static async updatePassword(token: string, password: string): Promise<void> {
    try {
      const hashedToken = await generateHashToken(token);
      const user = await prisma.user.findFirst({
        where: { resetToken: hashedToken },
        select: { id: true, email: true, isActive: true, resetTokenExpiresAt: true },
      });
      if (!user || !user.isActive || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
        throw new CustomError(ERROR_CODES.E401.message, 401);
      }
      const hashedPassword = await hashPassword(password);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, resetToken: null, resetTokenExpiresAt: null },
      });
    } catch (e: any) {
      throw e instanceof CustomError ? e : new CustomError(e.message, 500);
    }
  }

}
