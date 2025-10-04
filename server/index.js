require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const designRoutes = require("./routes/designs");

const app = express();

// ✅ CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://kruthika-matty.vercel.app"
];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error("CORS not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Body parser
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);

// MongoDB connection + server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
