import express from "express";
import mongoose from "mongoose";
import 'dotenv/config.js'; 
import User from "./model/user.js";
import Product from "./model/product.js";
import { uploads } from "./config/cloudinary.js";



const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connection.on("error", () =>
  console.log("Error connecting to MongoDB")
);

app.get("/", (req, res) => {
  res.send("Welcome to the server!");   
});

app.post("/api/user", async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    const user = await User.where({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create(req.body);
    if (!newUser) {
        return res.status(500).json({ message: "Error creating user" });
    }
    
   
    res.status(201).json({newUser:newUser, message: "User created successfully", user: { name, email } });

});
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({users:users});
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

app.post("/api/upload", uploads.array('images',4),  (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }
    
    const imageUrls = req.files.map(file => file.path);
    
    res.status(200).json({ message: "Files uploaded successfully", urls: imageUrls });
});

app.post('/api/single-upload', uploads.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    
    const imageUrl = req.file.path;
    
    res.status(200).json({ message: "File uploaded successfully", url: imageUrl });
}); 

app.post("/api/product", async (req, res) => {
    const { name, price, images } = req.body;
    if (!name || !price || !images || images.length === 0) {
        return res.status(400).json({ message: "Name, price, and at least one image are required" });
    }
    const newProduct = await Product.create(req.body);
    if (!newProduct) {
        return res.status(500).json({ message: "Error creating product" });
    }
    res.status(201).json({ newProduct: newProduct, message: "Product created successfully" });
});

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products: products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
}
);
app.get("/api/product/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ product: product });
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
}
);

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//     }
// );

  




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
