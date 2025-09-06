import mongoose from "mongoose";

const ItemSchema=new mongoose.Schema({
    title:{type:String, required: true},
    category:{type: String, enum:["Electronics", "Furniture", "Plastics to recycle/toys"]},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    images: [{ type: String }], 
    brand: {type: String,  required: true},
    model: {type: String,  required: true},
    dimensions:{type: Number,  required: true},
    weight: {type: Number,  required: true},
    material: {type: String,  required: true},
    color: {type: String,  required: true},
    quantity:{type: Number,  required: true},
    condition:{type: String,  required: true},
    year_of_manufacture:{type: Date,  required: true},
    originalpackaging:{type: String,  required: true},
    manual_inst:{type: String,  required: true},
    workingcondition:{type: String,  required: true},
});

export default mongoose.model("Item", ItemSchema, "items")
