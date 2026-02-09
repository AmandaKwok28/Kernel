import { z } from "zod";

export const folderIdParams = z.object({
    id: z.coerce.number().int().positive(),
})

export const createFolderBody = z.object({
    name: z.string().min(1, "Name is required"),
})

export const updateFolderBody = z.object({
    name: z.string().min(1).optional(),
}).refine(
    (data) => data.name !== undefined,
    { message: "At least one field must be provided" }
);
