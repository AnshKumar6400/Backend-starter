import { Response } from "express";

export class ApiResponse {
  static success(res: Response, data: any, message: string, statusCode: number = 200) {
    return res.status(statusCode).json({ success: true, data, message });
  }

  static error(res: Response, message: string, statusCode: number = 500) {
    return res.status(statusCode).json({ success: false, message });
  }
}