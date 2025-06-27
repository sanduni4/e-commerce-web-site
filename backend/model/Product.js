import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    productId :{
        type: String,
        required: true,
        unique: true
    },

    productName : {
        type: String,
        required: true
    },

    altName : [
        {
            type: String,
            required: true
        }
    ],

    image : [{
        type: String,
        required: true
    }],

    description : {
        type: String,
        required: true
    },

    price : {
        type: Number,
        required: true
    },

    lastPrice : {
        type: Number,
        required: true
       },     

    stock : {
        type: Number,
        required: true
    }

    
})

const Product = mongoose.model("product", productSchema)
export default Product;
