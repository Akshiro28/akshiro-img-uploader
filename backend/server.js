require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const authenticate = require("./authenticate");

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
const client = new MongoClient(process.env.MONGODB_URI);
let usersCollection;

async function connectToDB() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    usersCollection = db.collection("users");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectToDB();

// public route (anyone can access)
app.get("/api/public", (req, res) => {
  res.json({ message: "Everyone can see this." });
});

// protected route example (must be logged in)
app.post("/api/protected-route", authenticate, (req, res) => {
  res.json({ message: "Hello admin, update accepted!" });
});

// user registration route
// app.post("/api/users", authenticate, async (req, res) => {
  app.post("/api/users", async (req, res) => {
  try {
    if (!usersCollection) {
      console.error("❌ usersCollection is undefined");
      return res.status(500).json({ error: "MongoDB not connected" });
    }

    const { uid, email, name, photoURL, isAdmin } = req.body;
    console.log("📥 Incoming user:", req.body);

    if (!uid || !email) {
      return res.status(400).json({ error: "Missing uid or email" }); // ✅ JSON!
    }

    const existing = await usersCollection.findOne({ uid });
    if (existing) {
      console.log("ℹ️ User already exists:", email);
      return res.status(200).json({ message: "User already exists" }); // ✅ JSON!
    }

    await usersCollection.insertOne({
      uid,
      email,
      name,
      photoURL,
      isAdmin,
      createdAt: new Date(),
    });

    console.log("✅ User saved to MongoDB:", email);
    return res.status(201).json({ message: "User saved" }); // ✅ JSON!
  } catch (err) {
    console.error("🔥 Error in /api/users:", err);
    return res.status(500).json({ error: "Server error" }); // ✅ JSON!
  }
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
