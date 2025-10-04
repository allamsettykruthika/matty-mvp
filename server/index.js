require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const designRoutes = require("./routes/designs");

const app = express();

// ✅ Allow frontend (Vercel) to access backend (Render)
const corsOptions = {
  origin: [
    "https://matty-mvp.vercel.app", // custom domain (if you later add one)
    "https://matty-61jyjt9z7-kruthikas-projects-b31169d7.vercel.app", // current vercel URL
    "http://localhost:5173" // for local testing
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
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
