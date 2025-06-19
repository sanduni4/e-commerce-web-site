import express from "express";
import { createUser, loginUser } from "../controllers/UserController.js";

const UsersRouterouter = express.Router();

UsersRouterouter.post("/", createUser);
UsersRouterouter.post("/login",(loginUser))

export default UsersRouterouter;