import express from "express";
import { 
    createUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    getAllUsers, 
    toggleUserBlock 
} from "../controllers/UserController.js";

const UsersRouter = express.Router();

// Public routes
UsersRouter.post("/register", createUser);
UsersRouter.post("/login", loginUser);

// Protected routes (require authentication)
UsersRouter.get("/profile", getUserProfile);
UsersRouter.put("/profile", updateUserProfile);

// Admin only routes
UsersRouter.get("/", getAllUsers); // Get all users
UsersRouter.put("/:userId/toggle-block", toggleUserBlock); // Block/unblock user
UsersRouter.post("/admin", createUser); // Create admin user

export default UsersRouter;