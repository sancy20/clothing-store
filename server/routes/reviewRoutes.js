const express = require("express");
const router = express.Router();
const {
  createProductReview,
  getProductReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router
  .route("/:productId")
  .post(protect, createProductReview)
  .get(getProductReviews);

module.exports = router;
