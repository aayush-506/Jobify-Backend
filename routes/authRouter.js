import { Router } from "express";
import rateLimiter from "express-rate-limit";
import { login, logout, register } from "../controllers/authController.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/validationMiddleware.js";

const router = Router();
export default router;

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 7,
  message: {
    msg: "Rate exceeded, wait 15 minutes",
  },
});

router.post("/register", apiLimiter, validateRegisterInput, register);
router.post("/login", apiLimiter, validateLoginInput, login);
router.get("/logout", logout);
