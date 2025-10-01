import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import { errorMiddleware } from "./middlewares/error";

const app = express();

app.use(helmet());
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use("/auth", rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

app.use("/auth", authRouter);
app.use(errorMiddleware);

export default app;
