import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoutes from "./interfaces/routes/userRoutes";
import savingRoutes from "./interfaces/routes/savingRoutes";
import contributionRoutes from "./interfaces/routes/contributionRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", userRoutes);
app.use("/", savingRoutes);
app.use("/", contributionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
