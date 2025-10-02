const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  jsonData: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  thumbnailUrl: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Design", DesignSchema);
