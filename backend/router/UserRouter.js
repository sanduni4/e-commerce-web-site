import express from "express";
import { createUser, loginUser } from "../controllers/UserController.js";

const UsersRouter = express.Router();

UsersRouter.post("/", createUser);
UsersRouter.post("/login",(loginUser))

export default UsersRouter;
