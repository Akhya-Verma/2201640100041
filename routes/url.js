const express = require("express");
const router = express.Router();
const validUrl = require("valid-url");
const shortid = require("shortid");
const Url = require("../models/Url");
require("dotenv").config();

module.exports = router;

const baseUrl = process.env.BASE_URL;
// @route POST /api/url/shorten
router.post("/shorten", async (req, res) => {
  const { longUrl, validity, shortcode } = req.body;

  // Check base URL
  if (!validUrl.isUri(baseUrl)) {
    return res.status(400).json({ error: "Invalid base URL" });
  }

  // Validate input URL
  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({ error: "Invalid long URL" });
  }

  try {
    // Use custom shortcode if provided, else generate
    let urlCode = shortcode ? shortcode : shortid.generate();

    // Check uniqueness of shortcode
    let existing = await Url.findOne({ urlCode });
    if (existing) {
      if (shortcode) {
        return res.status(400).json({ error: "Shortcode already in use" });
      }
      urlCode = shortid.generate();
    }

    // Calculate expiry
    const duration = validity ? parseInt(validity) : 30; // in minutes
    const expiry = new Date(Date.now() + duration * 60 * 1000);

    const shortUrl = `${baseUrl}/${urlCode}`;

    const url = new Url({
      longUrl,
      shortUrl,
      urlCode,
      expiry,
    });

    await url.save();

    res.status(201).json({
      shortLink: shortUrl,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// @route GET /:code
router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (!url) return res.status(404).json({ error: "No URL found" });

    // Check expiry
    if (new Date() > url.expiry) {
      return res.status(410).json({ error: "Link expired" });
    }

    // Log click analytics
    url.clicks.push({
      referrer: req.get("Referrer") || "direct",
      geo: "unknown", // You can integrate IP-to-geo lookup later
    });

    await url.save();

    return res.redirect(url.longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// @route GET /api/url/stats/:code
router.get("/stats/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (!url) return res.status(404).json({ error: "No URL found" });

    res.json({
      longUrl: url.longUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt,
      expiry: url.expiry,
      totalClicks: url.clicks.length,
      clickDetails: url.clicks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
