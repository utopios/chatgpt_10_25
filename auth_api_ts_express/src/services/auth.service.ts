import * as argon2 from "argon2";
import { Conflict, Unauthorized } from "../errors/AppError";
import { UserRepo, User } from "../repositories/user.repo";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import crypto from "crypto";

type AuthResult = {
  accessToken: string;
  refreshToken: string;
  user: Pick<User, "id" | "email" | "createdAt">;
};

async function hash(data: string) {
  return argon2.hash(data);
}

async function verify(hashValue: string, data: string) {
  return argon2.verify(hashValue, data);
}

function hashTokenForStorage(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const AuthService = {
  async register(email: string, password: string): Promise<AuthResult> {
    const exists = await UserRepo.findByEmail(email);
    if (exists) throw Conflict("Email already registered", "EMAIL_TAKEN");

    const passwordHash = await hash(password);
    const user = await UserRepo.create(email, passwordHash);

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
    await UserRepo.setRefreshTokenHash(user.id, hashTokenForStorage(refreshToken));

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, createdAt: user.createdAt } };
  },

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await UserRepo.findByEmail(email);
    if (!user) throw Unauthorized("Invalid credentials", "INVALID_CREDENTIALS");

    const ok = await verify(user.passwordHash, password);
    if (!ok) throw Unauthorized("Invalid credentials", "INVALID_CREDENTIALS");

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
    await UserRepo.setRefreshTokenHash(user.id, hashTokenForStorage(refreshToken));

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, createdAt: user.createdAt } };
  },

  async logout(userId: string): Promise<void> {
    await UserRepo.setRefreshTokenHash(userId, null);
  },

  async rotateRefresh(userId: string, providedRefresh: string): Promise<AuthResult> {
    const user = await UserRepo.findById(userId);
    if (!user || !user.refreshTokenHash) throw Unauthorized("Invalid refresh", "INVALID_REFRESH");

    const matches = user.refreshTokenHash === hashTokenForStorage(providedRefresh);
    if (!matches) throw Unauthorized("Invalid refresh", "INVALID_REFRESH");

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const newRefresh = signRefreshToken({ sub: user.id, email: user.email });
    await UserRepo.setRefreshTokenHash(user.id, hashTokenForStorage(newRefresh));

    return { accessToken, refreshToken: newRefresh, user: { id: user.id, email: user.email, createdAt: user.createdAt } };
  },
};
