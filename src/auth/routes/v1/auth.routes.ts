import Router from "express";
import { AuthController } from "@/auth/controller/v1/auth.controller";
import { API_ROUTES } from "@/utils/constants/api.constants";
import { validateToken, validateInput, validateResetPasswordInput } from "@/middlewares/auth.middleware";

const router = Router();

router.post(API_ROUTES.AUTH.REGISTER, validateInput("REGISTER"), AuthController.register);
router.post(API_ROUTES.AUTH.LOGIN, validateInput("LOGIN"), AuthController.login);
router.post(API_ROUTES.AUTH.REFRESH, AuthController.refresh);
router.post(API_ROUTES.AUTH.LOGOUT, validateToken, AuthController.logout);
router.post(API_ROUTES.AUTH.RESET_PASSWORD, validateResetPasswordInput, AuthController.resetPassword);
router.post(API_ROUTES.AUTH.UPDATE_PASSWORD, AuthController.updatePassword);

export default router;