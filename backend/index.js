import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Add CORS for frontend communication
import UsersRouter from "./router/UserRouter.js";
import productRouter from "./router/productRouter.js";
import orderRouter from "./router/orderRouter.js";
import cartRouter from "./router/cartRouter.js"; // Add cart router
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const mongoURL = process.env.MONGO_DB_URI;

// Connect to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("MongoDB connection established successfully");
});

connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(bodyParser.json());

// JWT Authentication middleware
app.use((req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
            if (!error) {
                req.user = decoded;
            }
        });
    }
    next();
});

// Routes
app.use("/api/users", UsersRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter); // Add cart routes

// Health check route
app.get("/api/health", (req, res) => {
    res.json({
        message: "Server is running successfully",
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});