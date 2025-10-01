import request from "supertest";
import app from "../src/app";

describe("Auth API", () => {
  const email = "john.doe@example.com";
  const password = "VeryStrongPass#2025";

  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({ email, password });
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });

  it("should login the user", async () => {
    const res = await request(app).post("/auth/login").send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });

  it("should refresh tokens", async () => {
    const login = await request(app).post("/auth/login").send({ email, password });
    const cookie = login.header["set-cookie"]?.[0];

    const refresh = await request(app).post("/auth/refresh").set("Cookie", cookie);
    expect(refresh.status).toBe(200);
    expect(refresh.body.accessToken).toBeDefined();
  });

  it("should logout", async () => {
    const login = await request(app).post("/auth/login").send({ email, password });
    const cookie = login.header["set-cookie"]?.[0];

    const res = await request(app).post("/auth/logout").set("Cookie", cookie);
    expect(res.status).toBe(204);
  });

  it("should reject invalid login", async () => {
    const res = await request(app).post("/auth/login").send({ email, password: "wrong" });
    expect(res.status).toBe(401);
  });
});
