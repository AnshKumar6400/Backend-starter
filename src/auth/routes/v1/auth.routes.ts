import Router from "express";
import { AuthController } from "@/auth/controller/v1/auth.controller";
import {API_ROUTES} from "@/utils/constants/app.constants";
const router = Router();

router.post(API_ROUTES.AUTH.REGISTER, AuthController.register);
router.post(API_ROUTES.AUTH.LOGIN, AuthController.login);
router.post(API_ROUTES.AUTH.LOGOUT, AuthController.logout);
export default router;