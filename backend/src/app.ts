import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/", authRoutes);
app.use("/", noteRoutes);

export default app;