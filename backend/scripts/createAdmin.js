import mongoose from "mongoose";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("✅ Connected to MongoDB");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@example.com" });
        
        if (existingAdmin) {
            console.log("⚠️  Admin user already exists!");
            console.log("📧 Email: admin@example.com");
            console.log("🔑 Password: admin123");
            console.log("👤 Type: admin");
        } else {
            // Create admin user
            const adminUser = new User({
                firstName: "Admin",
                lastName: "User",
                email: "admin@example.com",
                Password: bcrypt.hashSync("admin123", 10),
                type: "admin",
                isBlocked: false,
                profilePicture: "https://via.placeholder.com/150?text=Admin"
            });

            await adminUser.save();
            
            console.log("✅ Admin user created successfully!");
            console.log("📧 Email: admin@example.com");
            console.log("🔑 Password: admin123");
            console.log("👤 Type: admin");
        }
        
        // Check if customer already exists
        const existingCustomer = await User.findOne({ email: "customer@example.com" });
        
        if (existingCustomer) {
            console.log("⚠️  Test customer already exists!");
            console.log("📧 Email: customer@example.com");
            console.log("🔑 Password: customer123");
            console.log("👤 Type: customer");
        } else {
            // Create test customer
            const customerUser = new User({
                firstName: "Test",
                lastName: "Customer",
                email: "customer@example.com",
                Password: bcrypt.hashSync("customer123", 10),
                type: "customer",
                isBlocked: false,
                profilePicture: "https://via.placeholder.com/150?text=Customer"
            });

            await customerUser.save();
            console.log("✅ Test customer created successfully!");
            console.log("📧 Email: customer@example.com");
            console.log("🔑 Password: customer123");
            console.log("👤 Type: customer");
        }

        console.log("\n🎉 Setup complete! You can now:");
        console.log("1. Start your backend server: npm run dev");
        console.log("2. Login as admin: admin@example.com / admin123");
        console.log("3. Login as customer: customer@example.com / customer123");

        await mongoose.connection.close();
        console.log("📊 Database connection closed");

    } catch (error) {
        console.error("❌ Error creating users:", error.message);
        process.exit(1);
    }
};

createAdminUser();