const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");

const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = await Review.findOne({
      where: {
        productId: productId,
        userId: req.user.id,
      },
    });

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      rating,
      comment,
      productId: productId,
      userId: req.user.id,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error while creating review" });
  }
};

/**
 * @desc    Get all reviews for a single product
 * @route   GET /api/reviews/:productId
 * @access  Public
 */
const getProductReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.findAll({
      where: { productId },
      include: {
        model: User,
        attributes: ["name"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error while fetching reviews" });
  }
};

module.exports = {
  createProductReview,
  getProductReviews,
};
