import { z } from "zod";

export const fileIdParam = z.object({
    id: z.coerce.number().int().positive(),
});

export const createFileBody = z.object({
    name: z.string().min(1, "Name is required"),
    content: z.string().optional()
})

export const updateFileBody = z.object({
    name: z.string().min(1).optional(),
    content: z.string().optional(),
})
.refine((data) => data.name !== undefined || data.content !== undefined, {
    message: "At least one field must be provided"
})