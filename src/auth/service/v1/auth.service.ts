import { prisma } from "@/config/app.config";
import { User } from "@/generated/prisma/client";
import {
  hashPassword,
  comparePassword,
  generateJwtToken,
  findByEmail,
} from "@/utils/helpers/app.helpers";
import { ERROR_CODES } from "@/utils/constants/app.constants";

export class AuthService {
  /**
   * @param fullName
   * @param email
   * @param password
   * @returns Promise<User>
   *
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
        throw new Error(ERROR_CODES.P2002.message);
      }
      throw new Error(e.message);
    }
  }

/**
 * 
 * @param email 
 * @param password 
 * @returns Promise<object>
 */
  static async login(email: string, password: string): Promise<object> {
    try {
      const user = await findByEmail(email);
      if (!user) {
        throw new Error(ERROR_CODES.E404.message);
      }
      if (!(await comparePassword(password, user.password))) {
        throw new Error(ERROR_CODES.E401.message);
      }
      const accessToken = generateJwtToken({ id: user.id, email: user.email }, "ACCESS");
      const refreshToken = generateJwtToken({ id: user.id, email: user.email }, "REFRESH");
      return { accessToken, refreshToken };
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
