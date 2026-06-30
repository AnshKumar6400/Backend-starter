import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config, prisma } from "@/config/app.config";
import crypto from "node:crypto";
import { ERROR_CODES } from "@/utils/constants/app.constants";
import { StringValue } from "ms";
/**
 * @param {string} password - Plain text password
 * @returns Promise<string> - Bcrypt hash
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
export const generateHashToken = async (token: string): Promise<string> => {
  return crypto.createHash('sha256').update(token).digest('hex');
}
/**
 * @param {string} password - Plain text password
 * @param {string} hash - Bcrypt hash to compare against
 * @returns Promise<Boolean>
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<Boolean> => {
  return await bcrypt.compare(password, hash);
};
/**
 * @param {object} payload - Data to encode in the token
 * @param {"ACCESS" | "REFRESH"} type - Token type, determines secret and expiry
 * @returns string - Signed JWT
 */
export const generateJwtToken = (
  payload: object,
  type: "ACCESS" | "REFRESH" ,
): string => {
  const { SECRET, EXPIRY } =
    type === "ACCESS" ? config.JWT.ACCESS_TOKEN : config.JWT.REFRESH_TOKEN;
  return jwt.sign(payload, SECRET!, { expiresIn: EXPIRY as StringValue });
};
/**
 * @param {string} token - JWT to verify
 * @param {"ACCESS" | "REFRESH"} type - Token type, determines which secret to use
 * @returns jwt.JwtPayload - Decoded token payload
 */
export const verifyJwtToken = (token: string, type: "ACCESS" | "REFRESH"): jwt.JwtPayload => {
  const secret = type === "ACCESS" ? config.JWT.ACCESS_TOKEN.SECRET : config.JWT.REFRESH_TOKEN.SECRET;
  return jwt.verify(token, secret) as jwt.JwtPayload;
};

export const generateResetToken = async (email: string): Promise<string> => {
  return  crypto.randomBytes(32).toString("hex");
}