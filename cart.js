import mongoose from "mongoose";
const { Schema, model } = mongoose; 
const cartSchema= new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    items:[
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref:"Item", required: true},
            quantity: {type: Number, required: true, default:1},
        }
    ]
});

export default mongoose.model("cart", cartSchema, "carts");