const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config(); // Load environment variables

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));


// Middlewares
app.use(cors());
app.use(express.json());

// Import routes and middleware
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth"); // Make sure you have this file

// Base route
app.get("/", (req, res) => {
    res.send("Billing API running");
});

// Auth routes
app.use("/api/v1/auth", authRoutes);

// Example protected route
app.get("/api/v1/protected", auth, (req, res) => {
    res.json({ message: "Protected data", user: req.user });
});

const productRoutes = require("./routes/products");
app.use("/api/v1/products", productRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
