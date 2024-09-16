import { Router, Request, Response} from "express";
import * as authController from '../controllers/authController'
import { hashPassword } from "../middleware/authMiddleware";
const router = Router();


router.get('/signup', authController.singup_get)
router.post('/signup', authController.singup_post)
router.get('/login', authController.login_get)
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get)

export default router;