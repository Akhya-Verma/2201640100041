const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: { type: String, default: "unknown" },
  geo: { type: String, default: "unknown" },
});

const UrlSchema = new mongoose.Schema({
  urlCode: { type: String, unique: true },
  longUrl: String,
  shortUrl: String,
  expiry: Date, // ISO 8601 expiry timestamp
  clicks: [ClickSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Url", UrlSchema);
