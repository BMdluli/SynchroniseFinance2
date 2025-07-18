import express from "express";
import userRoutes from "./interfaces/routes/userRoutes";
import savingRoutes from "./interfaces/routes/savingRoutes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", userRoutes);
app.use("/", savingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
