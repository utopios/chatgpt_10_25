import * as jwt from "jsonwebtoken"

const ACCESS_TTL = process.env.ACCESS_TTL ?? "15m";
const REFRESH_TTL = process.env.REFRESH_TTL ?? "7d";

const ACCESS_SECRET = process.env.ACCESS_SECRET ?? "dev_access_secret_change_me";
const REFRESH_SECRET = process.env.REFRESH_SECRET ?? "dev_refresh_secret_change_me";

type JwtPayload = { sub: string; email: string };

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL, algorithm: "HS256" });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL, algorithm: "HS256" });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}
