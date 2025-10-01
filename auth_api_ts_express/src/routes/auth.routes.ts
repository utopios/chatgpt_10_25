import { Router, Request, Response, NextFunction } from "express";
import { validate } from "../middlewares/validate";
import { loginSchema, refreshSchema, registerSchema } from "../validators/auth.validators";
import { AuthService } from "../services/auth.service";
import { verifyRefreshToken } from "../utils/jwt";
import { Unauthorized } from "../errors/AppError";

const router = Router();

const refreshCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/auth/refresh",
};

router.post("/register", validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await AuthService.register(email, password);
    res.cookie("refresh_token", refreshToken, refreshCookieOpts);
    res.status(201).json({ accessToken, user });
  } catch (e) {
    next(e);
  }
});

router.post("/login", validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await AuthService.login(email, password);
    res.cookie("refresh_token", refreshToken, refreshCookieOpts);
    res.status(200).json({ accessToken, user });
  } catch (e) {
    next(e);
  }
});

router.post("/refresh", validate(refreshSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refresh_token as string | undefined;
    if (!token) throw Unauthorized("Missing refresh token");

    const payload = verifyRefreshToken(token);
    const { accessToken, refreshToken, user } = await AuthService.rotateRefresh(payload.sub, token);

    res.cookie("refresh_token", refreshToken, refreshCookieOpts);
    res.status(200).json({ accessToken, user });
  } catch (e) {
    next(e);
  }
});

router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refresh_token as string | undefined;
    if (token) {
      const payload = verifyRefreshToken(token);
      await AuthService.logout(payload.sub);
    }
    res.clearCookie("refresh_token", { ...refreshCookieOpts, maxAge: 0 });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
