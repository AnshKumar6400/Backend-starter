import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config, prisma } from "@/config/app.config";
import { ERROR_CODES } from "@/utils/constants/app.constants";
import { StringValue } from "ms";
/**
 * 
 * @param password 
 * @returns Promise<string>
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
/**
 * 
 * @param password 
 * @param hash 
 * @returns Promise<Boolean>
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<Boolean> => {
  return await bcrypt.compare(password, hash);
};
/**
 * 
 * @param payload 
 * @param type 
 * @returns string
 */
export const generateJwtToken = (
  payload: object,
  type: "ACCESS" | "REFRESH",
): string => {
  const { SECRET, EXPIRY } =
    type === "ACCESS" ? config.JWT.ACCESS_TOKEN : config.JWT.REFRESH_TOKEN;
  return jwt.sign(payload, SECRET!, { expiresIn: EXPIRY as StringValue });
};
/**
 * 
 * @param email 
 * @returns object
 */
export const findByEmail = async (
  email: string,
): Promise<{ id: number; email: string; password: string } | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });
};
