const User = require("./User");
const Product = require("./Product");
const ProductImage = require("./ProductImage");
const ProductVariant = require("./ProductVariant");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Review = require("./Review");
const Address = require("./Address");
const WishlistItem = require("./WishlistItem");
const HeroPanel = require("./HeroPanel");

// --- Define Model Associations ---

// User and Order
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// Order and OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Product and OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// User and Review
User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

// Product and Review
Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId" });

// User and Address
User.hasMany(Address, { as: "addresses", foreignKey: "userId" });
Address.belongsTo(User, { foreignKey: "userId" });

// Product and ProductImage
Product.hasMany(ProductImage, { as: "images", foreignKey: "product_id" });
ProductImage.belongsTo(Product, { foreignKey: "product_id" });

// Product and ProductVariant
Product.hasMany(ProductVariant, { as: "variants", foreignKey: "product_id" });
ProductVariant.belongsTo(Product, { foreignKey: "product_id" });

// User and WishlistItem
User.hasMany(WishlistItem, { foreignKey: "userId" });
WishlistItem.belongsTo(User, { foreignKey: "userId" });

// Product and WishlistItem
Product.hasMany(WishlistItem, { foreignKey: "productId" });
WishlistItem.belongsTo(Product, { as: "product", foreignKey: "productId" });

// Export all models
module.exports = {
  User,
  Product,
  ProductImage,
  ProductVariant,
  Order,
  OrderItem,
  Review,
  Address,
  WishlistItem,
  HeroPanel,
};
