import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoutes from "./interfaces/routes/userRoutes";
import savingRoutes from "./interfaces/routes/savingRoutes";
import contributionRoutes from "./interfaces/routes/contributionRoutes";
import portfolioRoutes from "./interfaces/routes/portfolioRoutes";
import stockRoutes from "./interfaces/routes/stockRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", userRoutes);
app.use("/", savingRoutes);
app.use("/", contributionRoutes);
app.use("/", portfolioRoutes);
app.use("/", stockRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
