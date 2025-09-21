import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import savingRoutes from "./routes/savingRoutes";
import contributionRoutes from "./routes/contributionRoutes";
import portfolioRoutes from "./routes/portfolioRoutes";
import stockRoutes from "./routes/stockRoutes";
import budgetRoutes from "./routes/budgetRoutes";
import budgetCategoryRoutes from "./routes/budgetCategoryRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.synchronisefinance.com",
      "https://synchronisefinance.com",
    ],
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
