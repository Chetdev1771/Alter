const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const redisClient = require("../config/redis");

router.get("/:alias", async (req, res) => {
  const { alias } = req.params;

  try {
    // Check Redis cache first
    const cachedLongUrl = await redisClient.get(`short:${alias}`);

    if (cachedLongUrl) {
      console.log("Cache hit! Redirecting...");
      return res.redirect(cachedLongUrl);
    }

    // If not in cache, fetch from DB
    const url = await Url.findOne({ shortCode: alias });
    if (!url) return res.status(404).json({ error: "Short URL not found" });

    // Cache the long URL in Redis for faster future redirects
    await redisClient.set(`short:${alias}`, url.longUrl, { EX: 60 * 60 * 24 }); // Cache for 1 day

    return res.redirect(url.longUrl);
  } catch (error) {
    console.error("Redirection Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
