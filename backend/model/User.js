import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true,
  },

  firstName:{
    type: String,
    required: true,
  },

  lastName:{
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

  type:{
    type: String,
    default: "customer",
  },

  profilePicture:{
    type: String,
    default: "https://www.freepik.com/free-photos-vectors/default-user",}
});

const User = mongoose.model("Users", userSchema);

export default User;