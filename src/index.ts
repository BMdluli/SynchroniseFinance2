import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./interfaces/routes/userRoutes";
import savingRoutes from "./interfaces/routes/savingRoutes";
import contributionRoutes from "./interfaces/routes/contributionRoutes";
import portfolioRoutes from "./interfaces/routes/portfolioRoutes";
import stockRoutes from "./interfaces/routes/stockRoutes";
import budgetRoutes from "./interfaces/routes/budgetRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use("/", userRoutes);
app.use("/", savingRoutes);
app.use("/", contributionRoutes);
app.use("/", portfolioRoutes);
app.use("/", stockRoutes);
app.use("/", budgetRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
