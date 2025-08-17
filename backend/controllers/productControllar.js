import Product from "../model/product.js";
import mongoose from "mongoose";        
import { IsAdmin } from "./UserController.js";

export async function createProduct(req, res) {
    if (!IsAdmin(req)){
        res.status(401).json({
            message : "Please login as admin to add product"
        });
        return;
    }
        const newProductData = req.body;
    const product = new Product(newProductData);

    try{
    await product.save();
    res.json({
        message: "Product created successfully"
    });
} catch (error) {
    res.status(500).json({
        message: error,
    });
}
}

export async function getAllProducts(req, res) {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: error,
        });
    }
}
