const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: "localhost", // Change this if using a remote Redis instance
    port: 6379,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.connect(); // Connect to Redis

module.exports = redisClient;
