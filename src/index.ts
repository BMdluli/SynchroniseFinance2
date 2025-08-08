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
import budgetCategoryRoutes from "./interfaces/routes/budgetCategoryRoutes";
import { errorHandler } from "./interfaces/middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use("/", userRoutes);
app.use("/", savingRoutes);
app.use("/", contributionRoutes);
app.use("/", portfolioRoutes);
app.use("/", stockRoutes);
app.use("/", budgetRoutes);
app.use("/", budgetCategoryRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
