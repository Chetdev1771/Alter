const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const shortenRoutes = require("./routes/shorten");
const analyticsRoutes = require("./routes/analytics");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Firebase Admin SDK Setup
const serviceAccount = require("./serviceAcount.json"); // Replace with your Firebase Admin SDK JSON
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Authentication Middleware
const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1]; // Extract token

  if (!token) return res.status(401).json({ error: "Unauthorized - No token" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Firebase Token Verification Error:", error);
    res.status(403).json({ error: "Invalid or Expired Token" });
  }
};

// Routes
app.use("/api", verifyFirebaseToken, shortenRoutes);
app.use("/api", verifyFirebaseToken, analyticsRoutes);

// Server Start
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
