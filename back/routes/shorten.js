const express = require("express");
const router = express.Router();
const ShortUrl = require("../models/ShortUrl");
const { nanoid } = require("nanoid"); // Generate unique IDs
const useragent = require("useragent");

// Function to detect OS and Device Type
const detectDeviceInfo = (userAgentString) => {
    const agent = useragent.parse(userAgentString);
    const osType = agent.os.toString();
    const deviceType = /mobile|android|iphone|ipad/i.test(userAgentString) ? "mobile" : "desktop";
  
    return { osType, deviceType };
  };

// POST: Create Short URL
router.post("/shorten", async (req, res) => {
  const { longUrl, customAlias, topic } = req.body;
  const shortCode = customAlias || nanoid(6);

  try {
    // Check if alias is already taken
    const existingUrl = await Url.findOne({ shortCode });
    if (existingUrl) return res.status(400).json({ error: "Custom alias already in use" });

    // Create a new short URL
    const newUrl = new Url({
      longUrl,
      shortCode,
      topic,
      createdAt: new Date(),
    });

    await newUrl.save();

    // Cache the new short URL
    await redisClient.set(`short:${shortCode}`, longUrl, { EX: 60 * 60 * 24 }); // 1-day cache

    res.json({ shortUrl: `http://localhost:5000/api/shorten/${shortCode}`, createdAt: new Date() });
  } catch (error) {
    console.error("Shorten URL Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Redirect Short URL and Log Analytics
router.get("/:alias", async (req, res) => {
    try {
      const { alias } = req.params;
      const shortUrl = await ShortUrl.findOne({ shortCode: alias });
  
      if (!shortUrl) return res.status(404).json({ error: "Short URL not found" });
  
      // Get Device & OS Info
      const { osType, deviceType } = detectDeviceInfo(req.headers["user-agent"]);
  
      // Log analytics
      shortUrl.analytics.push({
        timestamp: new Date(),
        ip: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
        osType,
        deviceType,
      });
  
      await shortUrl.save();
  
      // Redirect to the original URL
      return res.redirect(shortUrl.longUrl);
    } catch (error) {
      console.error("Error redirecting:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

module.exports = router;
