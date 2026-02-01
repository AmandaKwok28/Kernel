import type { Request, Response, NextFunction } from "express";
import { fileIdParam } from "../schemas/file.js";
import { z } from "zod";

export function validateFileId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const parsed = fileIdParam.safeParse(req.params);

    if (!parsed.success) {
        return res.status(400).json({
            error: "Invalid file id"
        });
    }

    req.params.id = String(parsed.data.id);
    next();
}

export const validateBody = (schema: z.ZodTypeAny) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: parsed.error.flatten(),
      });
    }

    // replace the body with the validated data
    req.body = parsed.data;
    next();
}