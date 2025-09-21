import Order from "../model/Order.js"; 
import { IsCustomer } from "./UserController.js";

export async function createOrder(req, res) {
    // Fix: Call the function with (req) parameter
    if (!IsCustomer(req)) {
        return res.status(401).json({
            message: "Please login as customer to create an order"
        });
    }

    try {
        // Get the latest order to generate new order ID
        const latestOrder = await Order.find().sort({ date: -1 }).limit(1);
        
        let orderId;

        if (latestOrder.length == 0) {
            orderId = "CBC001";
        } else {
            // Fix: Use latestOrder[0].orderId instead of undefined currentOrderId
            const currentOrderId = latestOrder[0].orderId;
            const numberString = currentOrderId.replace("CBC", "");
            const number = parseInt(numberString);
            const newNumber = (number + 1).toString().padStart(3, "0");
            orderId = "CBC" + newNumber;
        }

        const newOrderData = req.body;
        newOrderData.orderId = orderId;
        newOrderData.userEmail = req.user.email;

        // Fix: Create new Order instance and save it
        const newOrder = new Order(newOrderData);
        await newOrder.save();
        
        res.json({
            message: "Order created successfully",
            orderId: orderId
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Add function to get user orders
export async function getUserOrders(req, res) {
    if (!IsCoustomer(req)) {
        return res.status(401).json({
            message: "Please login as customer to view orders"
        });
    }

    try {
        const orders = await Order.find({ userEmail: req.user.email }).sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Add function to get all orders (admin only)
export async function getAllOrders(req, res) {
    if (!req.user || req.user.type !== "admin") {
        return res.status(401).json({
            message: "Please login as admin to view all orders"
        });
    }

    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}