import Product from "../model/product.js";
import mongoose from "mongoose";        
import { IsAdmin } from "./UserController.js";

export async function createProduct(req, res) {
    if (!IsAdmin(req)) {
        return res.status(401).json({
            message: "Please login as admin to add product"
        });
    }

    try {
        const newProductData = req.body;
        const product = new Product(newProductData);
        await product.save();
        
        res.json({
            message: "Product created successfully",
            product: product
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

export async function getAllProducts(req, res) {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

// Add function to get single product by ID
export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ productId: id });
        
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

// Add function to update product (admin only)
export async function updateProduct(req, res) {
    if (!IsAdmin(req)) {
        return res.status(401).json({
            message: "Please login as admin to update product"
        });
    }

    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const product = await Product.findOneAndUpdate(
            { productId: id }, 
            updateData, 
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        
        res.json({
            message: "Product updated successfully",
            product: product
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

// Add function to delete product (admin only)
export async function deleteProduct(req, res) {
    if (!IsAdmin(req)) {
        return res.status(401).json({
            message: "Please login as admin to delete product"
        });
    }

    try {
        const { id } = req.params;
        const product = await Product.findOneAndDelete({ productId: id });
        
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        
        res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}