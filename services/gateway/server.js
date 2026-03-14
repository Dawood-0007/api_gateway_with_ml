import express from "express";
import appRouter from "./dummyReq/api.js";
import authRouter from "./authReq/auth.js";
import dataRouter from "./dataReq/data.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import { extractIP } from "./middleware/ip.js";
import { featureExtraction } from "./middleware/feature.js";
import { mlPrediction } from "./middleware/prediction.js";
import { requestLogger } from "./middleware/logger.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 5000;

app.use(extractIP);
app.use(featureExtraction);
app.use(mlPrediction);
app.use(requestLogger);

app.use("/api", appRouter);
app.use("/api/auth", authRouter)
app.use("/api/stat", dataRouter);

app.get("/", (req, res) => {
    const token = jwt.sign("Dawood", process.env.JWT_SECRET)
    res.send(token)
})

app.listen(PORT, () => console.log("Listening on port", PORT))