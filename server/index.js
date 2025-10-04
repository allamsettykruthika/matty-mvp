require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const designRoutes = require("./routes/designs");

const app = express();

// ✅ CORS setup (allow localhost + your Vercel frontend)
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "https://matty-frontend.vercel.app" // 🔹 replace with your actual Vercel domain
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is live and working!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);

// MongoDB + Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 5000; // fallback for local
    app.listen(port, () =>
      console.log(`✅ Server running on port ${port}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
