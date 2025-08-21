import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    orderId : {
        type: String,
        required: true,
        unique: true
    },

    userEmail : {
        type: String,
        required: true
    },

    orderItems : [
        {
            Name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },
            
            image : {
                type: String,
                required: true
            }
              }
    ],

    date : {
                type: Date,
                default: Date.now
            },
            
    paymentId : {
                type: String,
            },

    status : {
                type: String,
                default: "pending"
            },

    notes : {
               type:String
            },
           
    name :{
               type: String,
               required: true
            },

    address: {
               type : String,
               required: true
            },

    phoneNumber: {
              type: Number,
              require:true
            }

        })

        const Order = mongoose.model("Order", orderSchema);
        export default Order;
    