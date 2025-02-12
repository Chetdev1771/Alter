const express = require("express");
const router = express.Router();
const ShortUrl = require("../models/ShortUrl");
const moment = require("moment");

// GET: Retrieve Analytics for a Short URL
router.get("/analytics/:alias", async (req, res) => {
  const { alias } = req.params;

  try {
    // Check if analytics data exists in Redis
    const cachedAnalytics = await redisClient.get(`analytics:${alias}`);
    if (cachedAnalytics) {
      console.log("Cache hit! Serving analytics from Redis.");
      return res.json(JSON.parse(cachedAnalytics));
    }

    // Fetch analytics from DB if not in cache
    const url = await Url.findOne({ shortCode: alias });
    if (!url) return res.status(404).json({ error: "Short URL not found" });

    const analyticsData = {
      totalClicks: url.analytics.totalClicks,
      uniqueUsers: url.analytics.uniqueUsers,
      clicksByDate: url.analytics.clicksByDate,
      osType: url.analytics.osType,
      deviceType: url.analytics.deviceType,
    };

    // Store in Redis with expiration (e.g., 10 minutes)
    await redisClient.set(`analytics:${alias}`, JSON.stringify(analyticsData), { EX: 600 });

    res.json(analyticsData);
  } catch (error) {
    console.error("Analytics Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get Topic-Based Analytics
router.get("/analytics/topic/:topic", async (req, res) => {
    const { topic } = req.params;
  
    try {
      const urls = await ShortUrl.find({ topic });
      console.log(urls)
      if (!urls.length) {
        return res.status(404).json({ error: "No URLs found for this topic" });
      }
  
      let totalClicks = 0;
      let uniqueUsersSet = new Set();
      let clicksByDateMap = new Map();
      let urlAnalytics = [];
  
      urls.forEach((url) => {
        totalClicks += url.clicks.length;
        url.clicks.forEach((click) => uniqueUsersSet.add(click.userId));
  
        // Aggregate clicks by date
        url.clicks.forEach((click) => {
          const date = click.timestamp.toISOString().split("T")[0]; // Get only YYYY-MM-DD
          clicksByDateMap.set(date, (clicksByDateMap.get(date) || 0) + 1);
        });
  
        // Store URL-specific analytics
        urlAnalytics.push({
          shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
          totalClicks: url.clicks.length,
          uniqueUsers: new Set(url.clicks.map((c) => c.userId)).size,
        });
      });
  
      // Convert Map to an array of objects for response
      const clicksByDate = Array.from(clicksByDateMap, ([date, count]) => ({
        date,
        totalClicks: count,
      }));
  
      res.json({
        topic,
        totalClicks,
        uniqueUsers: uniqueUsersSet.size,
        clicksByDate,
        urls: urlAnalytics,
      });
    } catch (error) {
      console.error("Error fetching topic analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;
