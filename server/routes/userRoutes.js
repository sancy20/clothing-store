const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getMyAddresses,
  addMyAddress,
  updateMyAddress,
  deleteMyAddress,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private user profile routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin-only route
router.get("/", protect, admin, getAllUsers);

router
  .route("/addresses")
  .get(protect, getMyAddresses)
  .post(protect, addMyAddress);

router
  .route("/addresses/:id")
  .put(protect, updateMyAddress)
  .delete(protect, deleteMyAddress);

module.exports = router;
