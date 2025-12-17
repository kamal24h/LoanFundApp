import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import loanProductRoutes from "./routes/loanProduct.routes";
import loanRoutes from "./routes/loan.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Loan Fund API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/loan-products", loanProductRoutes);
app.use("/api/loans", loanRoutes);

export default app;
