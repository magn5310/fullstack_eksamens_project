import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

// Import routes (vi laver dem om til Express format)
 import authRoutes from "./routes/auth";
 import adminRoutes from "./routes/admin";
 import restaurantRoutes from "./routes/restaurants";
 import reviewRoutes from "./routes/reviews";
 import profileRoutes from "./routes/profile";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], 
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"], 
  })
);
app.use(morgan("combined"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
 app.use("/api/auth", authRoutes);
 app.use("/api/admin", adminRoutes);
 app.use("/api/restaurants", restaurantRoutes);
 app.use("/api/reviews", reviewRoutes);
 app.use("/api/profile", profileRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
