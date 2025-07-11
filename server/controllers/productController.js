const { Op, fn, col, literal } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const ProductVariant = require("../models/ProductVariant");
const User = require("../models/User");

const createProduct = async (req, res) => {
  try {
    // Basic product creation logic
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error while creating product." });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { search, brand, category, gender } = req.query;
    let whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    if (brand) {
      whereClause.brand = { [Op.in]: brand.split(",") };
    }
    if (category) whereClause.category = category;
    if (gender) whereClause.gender = gender;

    const products = await Product.findAll({
      where: whereClause,
      include: [
        {
          model: ProductVariant,
          as: "variants",
          attributes: ["color"],
        },
      ],
      distinct: true,
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error while fetching products." });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: ProductImage, as: "images" },
        { model: ProductVariant, as: "variants" },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error while fetching product." });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.update(req.body);
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error while updating product." });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: "Product removed successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error while deleting product." });
  }
};

const getNavigationData = async (req, res) => {
  try {
    const brands = await Product.findAll({
      attributes: [[fn("DISTINCT", col("brand")), "brand"]],
      order: [["brand", "ASC"]],
    });

    const menCategories = await Product.findAll({
      attributes: [
        "main_category",
        [fn("GROUP_CONCAT", fn("DISTINCT", col("category"))), "sub_categories"],
      ],
      where: { gender: { [Op.in]: ["Men", "Unisex"] } },
      group: ["main_category"],
      order: [["main_category", "ASC"]],
    });

    const womenCategories = await Product.findAll({
      attributes: [
        "main_category",
        [fn("GROUP_CONCAT", fn("DISTINCT", col("category"))), "sub_categories"],
      ],
      where: { gender: { [Op.in]: ["Women", "Unisex"] } },
      group: ["main_category"],
      order: [["main_category", "ASC"]],
    });

    const formatCategories = (data) => {
      return data
        .filter((item) => item.getDataValue("main_category") !== null)
        .map((item) => ({
          title: item.getDataValue("main_category"),
          items: item.getDataValue("sub_categories")
            ? item.getDataValue("sub_categories").split(",")
            : [],
        }));
    };

    res.json({
      brands: brands.map((item) => item.brand),
      men: formatCategories(menCategories),
      women: formatCategories(womenCategories),
    });
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching navigation data" });
  }
};

const addProductVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    const { color, size, stock_quantity } = req.body;

    if (!color || !size || stock_quantity === undefined) {
      return res
        .status(400)
        .json({ message: "Missing required variant fields." });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const newVariant = await ProductVariant.create({
      product_id: productId,
      color,
      size,
      stock_quantity,
    });

    res.status(201).json(newVariant);
  } catch (error) {
    console.error("Error adding product variant:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message:
          "This color and size combination already exists for this product.",
      });
    }
    res.status(500).json({ message: "Server error while adding variant." });
  }
};

const updateProductVariant = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { stock_quantity } = req.body;

    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found." });
    }

    variant.stock_quantity = stock_quantity;
    await variant.save();

    res.status(200).json(variant);
  } catch (error) {
    console.error("Error updating product variant:", error);
    res.status(500).json({ message: "Server error while updating variant." });
  }
};

const deleteProductVariant = async (req, res) => {
  try {
    const { variantId } = req.params;
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found." });
    }
    await variant.destroy();
    res.status(200).json({ message: "Variant deleted successfully." });
  } catch (error) {
    console.error("Error deleting product variant:", error);
    res.status(500).json({ message: "Server error while deleting variant." });
  }
};

const addProductImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { image_url, color_hint } = req.body;

    if (!image_url) {
      return res.status(400).json({ message: "Image URL is required." });
    }

    const newImage = await ProductImage.create({
      product_id: productId,
      image_url,
      color_hint,
    });

    res.status(201).json(newImage);
  } catch (error) {
    console.error("Error adding product image:", error);
    res.status(500).json({ message: "Server error while adding image." });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await ProductImage.findByPk(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }
    await image.destroy();
    res.status(200).json({ message: "Image deleted successfully." });
  } catch (error) {
    console.error("Error deleting product image:", error);
    res.status(500).json({ message: "Server error while deleting image." });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const currentProduct = await Product.findByPk(req.params.id);
    if (!currentProduct) return res.json([]);
    const relatedProducts = await Product.findAll({
      where: {
        category: currentProduct.category,
        id: { [Op.ne]: currentProduct.id },
      },
      limit: 4,
      order: literal("RAND()"),
    });
    res.json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getNavigationData,
  getRelatedProducts,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
  addProductImage,
  deleteProductImage,
};
