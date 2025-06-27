import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import UsersRouter from "./router/UserRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const mongoURL = process.env.MONGO_DB_URI;


mongoose.connect(mongoURL,{})

const connection = mongoose.connection;

connection.once("open", ()=>{

    console.log("MongoDB connection established successfully");
})


app.use(bodyParser.json());

app.use(
    (req,res,next)=>
    {
        const token = req.header("Authorization")?.replace
        ("Bearer ","");
        console.log(token);

        if(token != null){
            jwt.verify(token,process.env.SECRET_KEY, (error,decoded)=>{
                
                if (!error){
                    req.user = decoded;
                }
            }

                )
                
            }
        next();
    });

app.use("/api/Users", UsersRouter);


app.listen(
    
    5000,
    ()=>{
        console.log("Server is running on port 5000");
    }

)