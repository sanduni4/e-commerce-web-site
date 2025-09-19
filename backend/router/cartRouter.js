import express from "express";
import { 
    addToCart, 
    getCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
} from "../controllers/cartController.js";

const cartRouter = express.Router();

// GET user's cart
cartRouter.get("/", getCart);

// POST add item to cart
cartRouter.post("/add", addToCart);

// PUT update cart item quantity
cartRouter.put("/:productId", updateCartItem);

// DELETE remove item from cart
cartRouter.delete("/:productId", removeFromCart);

// DELETE clear entire cart
cartRouter.delete("/", clearCart);

export default cartRouter;