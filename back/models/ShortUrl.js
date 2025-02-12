const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
  osType: String,
  deviceType: String,
});

const shortUrlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, unique: true, required: true },
  topic: { type: String, default: "general" },
  createdAt: { type: Date, default: Date.now },
  analytics: [analyticsSchema], // Store analytics data
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
