import express from "express";
import cors from "cors";
import multer from "multer";

import { auth } from "./middleware.js";
import { register, login } from "./auth.js";
import { uploadExcel } from "./excelUpload.js";
import { addRecord, updatePayment, freeze, report } from "./actions.js";
import "./cron.js";

const app = express();
const PORT = 4000;

// middlewares
app.use(cors());
app.use(express.json());

// multer
const upload = multer({ dest: "uploads/" });

// routes
app.post("/register", register);
app.post("/login", login);

app.post("/upload-excel", auth, upload.single("file"), uploadExcel);
app.post("/add-record", auth, addRecord);
app.post("/update-payment", auth, updatePayment);
app.post("/freeze", auth, freeze);
app.get("/report", auth, report);

// health check
app.get("/", (req, res) => {
  res.send("Debt Manager running");
});

app.listen(PORT, () => {
  console.log("Debt Manager running on port", PORT);
});