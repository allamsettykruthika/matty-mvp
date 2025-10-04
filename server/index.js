require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const designRoutes = require("./routes/designs");

const app = express();

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:3000",                  // React dev server
  "http://localhost:5173",                  // Vite dev server
  "https://kruthika-matty.vercel.app/" // Replace with your actual Vercel frontend URL
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow Postman or server-to-server requests
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'CORS policy does not allow this origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// JSON parsing
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
  .catch((err) => console.error("❌ MongoDB connection error:", err));
