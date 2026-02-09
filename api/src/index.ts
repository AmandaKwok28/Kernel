import express from 'express';
import cors from 'cors';
import { fileRouter } from "../src/routes/file.js";
import { folderRouter } from './routes/folder.js';

const app = express()
const port = 3000

app.use(cors({
  // origin: "http://localhost:5173",
  origin: true,     // JUST FOR DEV
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use("/files", fileRouter);
app.use("/folders", folderRouter);

app.get('/', (_, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
