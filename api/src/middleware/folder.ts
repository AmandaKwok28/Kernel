import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { folderIdParams } from "../schemas/folder.js";

export function validateFolderId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const parsed = folderIdParams.safeParse(req.params);

    if (!parsed.success) {
        return res.status(400).json({
            error: "Invalid folder id"
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

    req.body = parsed.data;
    next()
}