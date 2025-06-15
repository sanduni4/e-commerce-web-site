import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Email:{
    type: String,
    required: true,
    unique: true,
  },

  First_Name:{
    type: String,
    required: true,
  },

  Last_Name:{
    type: String,
    required: true,
  },

  Password:{
    type: String,
    required: true,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  Type:{
    type: String,
    enum: ["Admin", "User", "Owner"],
    default: "User",
  }
});

const User = mongoose.model("User", userSchema);

export default User;