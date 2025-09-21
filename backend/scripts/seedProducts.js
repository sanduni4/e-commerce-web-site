import mongoose from "mongoose";
import Product from "../model/product.js";
import dotenv from "dotenv";

dotenv.config();

const sampleProducts = [
    {
        productId: "PRD001",
        productName: "Wireless Bluetooth Headphones",
        altName: ["Bluetooth Headphones", "Wireless Headphones"],
        image: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
        ],
        description: "High-quality wireless Bluetooth headphones with noise cancellation and long battery life.",
        price: 99.99,
        lastPrice: 129.99,
        stock: 50
    },
    {
        productId: "PRD002",
        productName: "Smartphone Case",
        altName: ["Phone Case", "Mobile Case"],
        image: [
            "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500"
        ],
        description: "Durable and stylish smartphone case with shock protection.",
        price: 24.99,
        lastPrice: 34.99,
        stock: 100
    },
    {
        productId: "PRD003",
        productName: "USB-C Cable",
        altName: ["Charging Cable", "Type-C Cable"],
        image: [
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"
        ],
        description: "Fast charging USB-C cable compatible with most modern devices.",
        price: 12.99,
        lastPrice: 19.99,
        stock: 200
    },
    {
        productId: "PRD004",
        productName: "Wireless Mouse",
        altName: ["Computer Mouse", "PC Mouse"],
        image: [
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"
        ],
        description: "Ergonomic wireless mouse with precise tracking and long battery life.",
        price: 39.99,
        lastPrice: 49.99,
        stock: 75
    },
    {
        productId: "PRD005",
        productName: "Portable Power Bank",
        altName: ["Battery Pack", "Phone Charger"],
        image: [
            "https://images.unsplash.com/photo-1609592094345-45e8b739cd4e?w=500"
        ],
        description: "10000mAh portable power bank with fast charging capability.",
        price: 34.99,
        lastPrice: 44.99,
        stock: 80
    }
];

async function seedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB");

        // Clear existing products
        await Product.deleteMany({});
        console.log("Cleared existing products");

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log("Sample products inserted successfully");

        // Close connection
        await mongoose.connection.close();
        console.log("Database connection closed");
        
    } catch (error) {
        console.error("Error seeding products:", error);
        process.exit(1);
    }
}

seedProducts();