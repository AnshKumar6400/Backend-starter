import Router from "express";
const router = Router();
import authRouter from "@/auth/routes/v1/auth.routes";
router.use("/auth", authRouter);
export default router;
