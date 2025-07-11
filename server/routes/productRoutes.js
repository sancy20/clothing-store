const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getNavigationData,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
  addProductImage,
  deleteProductImage,
  getRelatedProducts,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", getAllProducts);

router.get("/navigation-data", getNavigationData);

router.post("/", protect, admin, createProduct);

router.get("/:id", getProductById);

router.put("/:id", protect, admin, updateProduct);

router.delete("/:id", protect, admin, deleteProduct);

// Variant routes
router.post("/:productId/variants", protect, admin, addProductVariant);
router.put("/variants/:variantId", protect, admin, updateProductVariant);
router.delete("/variants/:variantId", protect, admin, deleteProductVariant);

// Image routes
router.post("/:productId/images", protect, admin, addProductImage);
router.delete("/images/:imageId", protect, admin, deleteProductImage);

router.get("/:id/related", getRelatedProducts);

module.exports = router;
