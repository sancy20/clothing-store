const WishlistItem = require("../models/WishlistItem");
const Product = require("../models/Product");

const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(wishlistItems);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching wishlist." });
  }
};

const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    const [item, created] = await WishlistItem.findOrCreate({
      where: { userId: req.user.id, productId: productId },
      defaults: { userId: req.user.id, productId: productId },
    });

    if (!created) {
      return res.status(409).json({ message: "Item already in wishlist." });
    }
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error while adding to wishlist." });
  }
};

const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  try {
    const item = await WishlistItem.findOne({
      where: { userId: req.user.id, productId: productId },
    });

    if (item) {
      await item.destroy();
      res.json({ message: "Item removed from wishlist." });
    } else {
      res.status(404).json({ message: "Item not found in wishlist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while removing from wishlist." });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
