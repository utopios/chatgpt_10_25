import crypto from "crypto";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  refreshTokenHash?: string | null;
  createdAt: Date;
};

const users = new Map<string, User>();

export const UserRepo = {
  async findByEmail(email: string): Promise<User | null> {
    for (const u of users.values()) if (u.email === email) return u;
    return null;
  },
  async findById(id: string): Promise<User | null> {
    return users.get(id) ?? null;
  },
  async create(email: string, passwordHash: string): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = { id, email, passwordHash, createdAt: new Date(), refreshTokenHash: null };
    users.set(id, user);
    return user;
  },
  async setRefreshTokenHash(id: string, hash: string | null): Promise<void> {
    const u = users.get(id);
    if (u) {
      u.refreshTokenHash = hash;
      users.set(id, u);
    }
  },
};
