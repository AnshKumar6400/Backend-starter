import { prisma } from "@/config/app.config";
import { User } from "@/generated/prisma/client";
import {
  hashPassword,
  comparePassword,
  generateJwtToken,
  verifyJwtToken,
  findByEmail,
} from "@/utils/helpers/app.helpers";
import { ERROR_CODES } from "@/utils/constants/app.constants";
import { CustomError } from "@/utils/errors/CustomError";

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
  static async resetPassword(email:string){
    const user = await findByEmail(email);
  }
}

