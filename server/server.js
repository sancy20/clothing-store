const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const path = require("path");
require("dotenv").config();

// --- 1. Import All Routes ---
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const heroPanelRoutes = require("./routes/heroPanelRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// --- 2. Middleware ---
const allowedOrigins = ["http://localhost:5173", "http://128.199.193.250"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// --- 3. Database Connection & Sync ---
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");

    console.log("✅ Sequelize is connected, sync disabled.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
}
connectToDatabase();

// --- 4. Use API Routes ---
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/hero-panels", heroPanelRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the Streetwear E-Commerce API!" });
});

// --- 5. Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// --- 6. Server Listener ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
