import Order from "../model/Order.js"; 
import { IsCoustomer } from "./UserController.js";

export async function createOrder(req,res){

    if(!IsCoustomer){
        res.json({
            message:"Please login as customer to create an order"
        })
    }

 // cbc 001
 //take the latest product id
 try{
    const latestOrder = await Order.find().sort
    ({date:-1}).limit(1);
    
    let orderId


 if (latestOrder.length == 0){
    orderId = "CBC001";
 }else{
    // convert order id te number

    const numberString = currentOrderId.replace("CBC","")

    const number = parseInt(numberString)

    const newNumber = (number + 1).toString().padStart(4,"0")
    orderId = "CBC" + newNumber;
 }

 const newOrderData = req.body
 newOrderData.orderId = orderId;
 newOrderData.userEmail = req.user.email;

 await Order.save()
 
 res.json({
    message:"Order created successfully"
 })

 }
 catch(error){
    res.status(500).json({
        message : error.message
    })
    
 }

}
