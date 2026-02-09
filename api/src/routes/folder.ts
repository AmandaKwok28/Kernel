import { Router } from "express";
import { Folders } from "../services/folders.js";
import { validateBody, validateFolderId } from "../middleware/folder.js";
import { createFolderBody, updateFolderBody } from "../schemas/folder.js";

export const folderRouter = Router();

// return all folders
folderRouter.get("/", (_, res) => {
    res.status(200).json({
        data: Folders.get(),
        message: "ok"
    })
})

folderRouter.get(
    "/:id",
    validateFolderId, 
    (req, res) => {
        const folder = Folders.getById(Number(req.params.id));

        if (!folder) {
            return res.sendStatus(404);
        }

        res.status(200).json({
            data: folder,
            message: "ok"
        });
    }
)

folderRouter.post(
    "/",
    validateBody(createFolderBody),
    (req, res) => {
        const { name } = req.body;
        const folder = Folders.create(name);

        res.status(201).json({
            data: folder,
            message: "ok"
        })
    }
)


folderRouter.patch(
    "/:id",
    validateFolderId,
    validateBody(updateFolderBody),
    (req, res) => {
        const id = Number(req.params.id);
        const { name } = req.body;

        const updated = Folders.update(id, name);

        if (!updated) {
            return res.sendStatus(404);
        }

        res.status(200).json({
            data: updated,
            message: "ok"
        });
    }
)

folderRouter.delete(
    "/:id",
    validateFolderId,
    (req, res) => {
        const id = Number(req.params.id);
        const deleted = Folders.delete(id);

        if (!deleted) {
            return res.sendStatus(404);
        }

        res.status(200).json({
            data: [],
            message: "ok"
        });
    }
)