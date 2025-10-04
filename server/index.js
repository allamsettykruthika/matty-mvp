require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const designRoutes = require("./routes/designs");

const app = express();

// ✅ Allow frontend (Vercel) to access backend (Render)
const corsOptions = {
  origin: ["https://matty-mvp.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);

// MongoDB + Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 5000; // ✅ fallback for local
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
