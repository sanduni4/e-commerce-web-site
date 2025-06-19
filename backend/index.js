import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import UsersRouter from "./router/UserRouter.js";
import ProductRouter from "./router/ProductRouter.js";

const app = express();
const mongoURL = "mongodb+srv://sandu:sandu@cluster0.pwd8stl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


mongoose.connect(mongoURL,{})

const connection = mongoose.connection;

connection.once("open", ()=>{

    console.log("MongoDB connection established successfully");
})


app.use(bodyParser.json());

app.use("/api/Users", UsersRouter);
app.use("/api/Products",ProductRouter);

app.listen(
    
    5000,
    ()=>{
        console.log("Server is running on port 5000");
    }

)