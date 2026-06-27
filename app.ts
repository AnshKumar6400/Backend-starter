import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { config } from "@/config/app.config";
import v1Router from "@/routes/v1/index";
import { CustomError } from "@/utils/errors/CustomError";
import { ApiResponse } from "@/utils/response/APIResponse";
import { API_PREFIX } from "@/utils/constants/app.constants";

const app = express();

const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after an hour",
});

app.use(rateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.CORS.ORIGIN, credentials: config.CORS.CREDS }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "Server is running" });
});

app.use(API_PREFIX, v1Router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = err.message || "Internal server error";
  ApiResponse.error(res,message,statusCode)
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});