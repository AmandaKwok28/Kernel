import { Router } from "express";
import { Files } from "../services/files.js";
import { validateBody, validateFileId } from "../middleware/file.js";
import { createFileBody, updateFileBody } from "../schemas/file.js";

export const fileRouter = Router();

// get all files
fileRouter.get("/", (_, res) => {
    res.status(200).json({
        data: Files.get(),
        message: "ok"
    });
});


// get a file by Id
fileRouter.get(
    "/:id", 
    validateFileId,
    (req, res) => {

    const file = Files.getById(Number(req.params.id));
    
    if (!file) {
        return res.sendStatus(404);
    }

    res.status(200).json({
        data: file,
        message: "ok"
    });
})


// create a new file
fileRouter.post(
    "/",
    validateBody(createFileBody), 
    (req, res) => {

    const { name, content, folder_id } = req.body;
    const file = Files.create(name, content, folder_id);

    res.status(201).json({
        data: file,
        message: "ok"
    });
})


// update a file
fileRouter.patch(
  "/:id",
  validateFileId,
  validateBody(updateFileBody),
  (req, res) => {
    const id = Number(req.params.id);
    const { name, content, folder_id } = req.body;

    const updated = Files.update(id, name, content, folder_id);

    if (!updated) {
      return res.sendStatus(404);
    }

    res.status(200).json({
      data: updated,
      message: "ok",
    });
  }
);


// delete a file
fileRouter.delete(
    "/:id",
    validateFileId,
    (req, res) => {
        const id = Number(req.params.id);
        const deleted = Files.delete(id);

        if (!deleted) {
            return res.sendStatus(404);
        }

        res.status(200).json({
            data: [],
            message: "ok"
        })
    }
)