import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import UsersRouter from "./routes/UsersRouter.js";

const app = express();
const mongoURL = "mongodb+srv://sandu:sandu@cluster0.pwd8stl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connection = mongoose.connection;

mongoose.connect(mongoURL)
.then(()=>{
    console.log("database connected");
}).catch(()=>{
    console.log("database connection failed");
})


app.use(bodyParser.json());

app.use("/api/users", UsersRouter);

app.listen(
    5000,
    ()=>{
        console.log("Server is running on port 5000");
    }
)