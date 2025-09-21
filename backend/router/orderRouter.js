import express from "express";
import { createOrder, getUserOrders, getAllOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

// POST create new order (customer only)
orderRouter.post("/:id", createOrder);

// GET user's orders (customer only)
orderRouter.get("/user/", getUserOrders);

// GET all orders (admin only)
orderRouter.get("/", getAllOrders);

export default orderRouter;