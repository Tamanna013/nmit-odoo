import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "./models/User.js"; 
import item from "./models/items.js";
import cart from "./models/cart.js";
import transaction from "./models/transaction.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI, {
  dbName: "ecofinds",
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error(" DB Error:", err));

// SIGNUP
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;  
    const existing = await User.findOne({ email });

    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      passwordHash: hashPassword,  
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.passwordHash); // ✅ fixed
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

//middleware to protect the routes

const authmiddleware= (req, res, next)=>{
    const token = req.header("Authorization")?.split(" ")[1];
    if(!token) return res.status(400).json({message: "No token, authorization denied"});

    try {
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch(err){
        res.status(401).json({message:"Token invalid"});
    }
};

//upload a new item

app.post("/api/items", authmiddleware, async(req,res)=>{
    try{
        const { title,
      description,
      category,
      condition,
      price,
      images,
      quantity,
      brand,
      model,
      dimensions,
      weight,
      material,
      color,
      originalPackaging,
      manualIncluded,
      workingCondition,
      year_of_manufacture} = req.body;
        const newitem= new item ({
 title,
      description,
      category,
      condition,
      price: price || 0,
      images: images ? [images] : [], // convert single string to array
      quantity: quantity || 1,
      brand,
      model,
      dimensions: dimensions?.length || 0, // adjust according to schema
      weight: weight || 0,
      material: material || "",
      color: color || "",
      originalpackaging: originalPackaging ? "Yes" : "No",
      manual_inst: manualIncluded ? "Yes" : "No",
      workingcondition: workingCondition || "",
      year_of_manufacture: year_of_manufacture ? new Date(year_of_manufacture) : null,
      seller: req.user.id
});

        await newitem.save();
        res.status(201).json({message:"item uploaded successfully", item: newitem});

    } catch (err){
        res.status(500).json({ message: err.message });
    }
});

//get all items
app.get("/api/items", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.type) filter.type = req.query.type;

    const items = await item.find(filter).populate("seller", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get items uploaded by logged in user
app.get("/api/my-items", authmiddleware, async (req, res) => {
  try {
    const items = await item.find({ seller: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add item to cart
app.post("/api/cart", authmiddleware, async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    let userCart = await cart.findOne({ user: req.user.id });
    if (!userCart) userCart = new cart({ user: req.user.id, items: [] });

    const index = userCart.items.findIndex(i => i.product.toString() === itemId);
    if (index > -1) {
      userCart.items[index].quantity += quantity;
    } else {
      userCart.items.push({ product: itemId, quantity });
    }

    await userCart.save();
    res.json(userCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View cart
app.get("/api/cart", authmiddleware, async (req, res) => {
  try {
    const userCart = await cart.findOne({ user: req.user.id }).populate("items.product");
    res.json(userCart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Checkout items in cart
app.post("/api/checkout", authmiddleware, async (req, res) => {
  try {
    const { items } = req.body; // [{ itemId, quantity }]
    const transactions = [];

    for (const i of items) {
      const currentItem = await item.findById(i.itemId);
      if (!currentItem) continue;

      const transactionEntry = new transaction({
        buyer: currentItem.type === "For Sale" ? req.user.id : null,
        seller: currentItem.seller,
        item: currentItem._id,
        type: currentItem.type === "For Sale" ? "Sale" : currentItem.type,
        priceAtTransaction: currentItem.price
      });

      await transactionEntry.save();

      // Update item quantity for sale
      if (currentItem.type === "For Sale") {
        currentItem.quantity -= i.quantity;
        if (currentItem.quantity <= 0) currentItem.status = "sold";
        await currentItem.save();
      }

      transactions.push(transactionEntry);
    }

    // Clear cart after checkout
    await cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.json({ message: "Checkout complete", transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View user's transactions
app.get("/api/my-transactions", authmiddleware, async (req, res) => {
  try {
    const transactionsList = await transaction.find({
      $or: [{ buyer: req.user.id }, { seller: req.user.id }]
    })
    .populate("buyer", "name email")
    .populate("seller", "name email")
    .populate("item");

    res.json(transactionsList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
