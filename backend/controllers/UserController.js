import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function createUser(req, res) {
    const newUserData = req.body;

    // Check if trying to create admin account
    if (newUserData.type === "admin") {
        if (req.user == null) {
            return res.status(401).json({
                message: "Please login as admin to create admin account",
            });
        }

        if (req.user.type !== "admin") {
            return res.status(401).json({
                message: "Please login as admin to create admin account",
            });
        }
    }

    // Hash password
    newUserData.Password = bcrypt.hashSync(newUserData.Password, 10);
    
    const user = new User(newUserData);
    
    user.save().then(() => {
        res.json({
            message: "User created successfully"
        });
    }).catch((error) => {
        res.status(500).json({
            message: "User not created",
            error: error.message
        });
    });
}

export function loginUser(req, res) {
    const { email, Password } = req.body;

    // Validation
    if (!email || !Password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    User.find({ email: email }).then((users) => {
        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = users[0];

        // Check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked. Please contact support."
            });
        }

        const isPasswordValid = bcrypt.compareSync(Password, user.Password);

        if (isPasswordValid) {
            const token = jwt.sign({
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isBlocked: user.isBlocked,
                type: user.type,
                profilePicture: user.profilePicture,
            }, process.env.SECRET_KEY, {
                expiresIn: '7d' // Token expires in 7 days
            });

            console.log("Login successful for:", user.email, "Type:", user.type);
            
            res.json({
                message: "Login successful", 
                token: token,
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    type: user.type,
                    profilePicture: user.profilePicture
                }
            });
        } else {
            res.status(401).json({
                message: "Incorrect password. Please try again.",
            });
        }
    }).catch((error) => {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Login failed due to server error",
            error: error.message
        });
    });
}

export function IsAdmin(req) {
    if (req.user == null) {
        return false;
    }
    if (req.user.type !== "admin") {
        return false;
    }
    return true;
}    

export function IsCustomer(req) {
    if (req.user == null) {
        return false;
    }
    if (req.user.type !== "customer") {
        return false;
    }
    return true; 
}

// Get user profile
export function getUserProfile(req, res) {
    if (!req.user) {
        return res.status(401).json({
            message: "Please login to view profile"
        });
    }

    User.findById(req.user._id).select('-Password').then((user) => {
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user: user
        });
    }).catch((error) => {
        res.status(500).json({
            message: "Failed to get user profile",
            error: error.message
        });
    });
}

// Update user profile
export function updateUserProfile(req, res) {
    if (!req.user) {
        return res.status(401).json({
            message: "Please login to update profile"
        });
    }

    const updateData = req.body;
    
    // Don't allow updating password through this endpoint
    delete updateData.Password;
    delete updateData.type; // Don't allow type change through profile update

    User.findByIdAndUpdate(req.user._id, updateData, { new: true })
        .select('-Password')
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                message: "Profile updated successfully",
                user: user
            });
        }).catch((error) => {
            res.status(500).json({
                message: "Failed to update profile",
                error: error.message
            });
        });
}

// Get all users (Admin only)
export function getAllUsers(req, res) {
    if (!IsAdmin(req)) {
        return res.status(401).json({
            message: "Admin access required"
        });
    }

    User.find().select('-Password').then((users) => {
        res.json(users);
    }).catch((error) => {
        res.status(500).json({
            message: "Failed to get users",
            error: error.message
        });
    });
}

// Block/Unblock user (Admin only)
export function toggleUserBlock(req, res) {
    if (!IsAdmin(req)) {
        return res.status(401).json({
            message: "Admin access required"
        });
    }

    const { userId } = req.params;
    const { isBlocked } = req.body;

    User.findByIdAndUpdate(userId, { isBlocked: isBlocked }, { new: true })
        .select('-Password')
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
                user: user
            });
        }).catch((error) => {
            res.status(500).json({
                message: "Failed to update user status",
                error: error.message
            });
        });
}