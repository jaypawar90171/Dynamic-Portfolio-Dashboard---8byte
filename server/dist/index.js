import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import portfolioRouter from "./routes/portfolio.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// health check endpoint
app.get("/", (req, res) => {
    res.json({ message: "Backend is running" });
});
// portfolio endpoint
app.use("/api/portfolio", portfolioRouter);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map