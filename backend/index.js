import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import UsersRouter from "./router/UserRouter.js";
import ProductRouter from "./router/ProductRouter.js";
import jwt from "jsonwebtoken";

const app = express();
const mongoURL = "mongodb+srv://sandu:sandu@cluster0.pwd8stl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


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
            jwt.verify(token,"cBc-secret-key-1234", (error,decoded)=>{
                
                if (!error){
                    req.user = decoded;
                }
            }

                )
                
            }
        next();
    });

app.use("/api/Users", UsersRouter);
app.use("/api/Products",ProductRouter);

app.listen(
    
    5000,
    ()=>{
        console.log("Server is running on port 5000");
    }

)