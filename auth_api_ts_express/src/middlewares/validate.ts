import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { BadRequest } from "../errors/AppError";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
    if (!result.success) {
      return next(BadRequest("Validation error", "VALIDATION_ERROR"));
    }
    req.body = (result.data as any).body ?? req.body;
    next();
  };
