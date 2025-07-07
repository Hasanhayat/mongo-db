import express from "express";
import mongoose from "mongoose";
import 'dotenv/config.js'; 
import User from "./model/user.js";



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

    const user = await User.$where({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create(req.body);
    
   
    res.status(201).json({newUser:newUser, message: "User created successfully", user: { name, email } });

});
  




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
