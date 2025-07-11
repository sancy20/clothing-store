const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WishlistItem = sequelize.define(
  "WishlistItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
  },
  {
    tableName: "wishlist_items",
    timestamps: true,
    uniqueKeys: {
      user_product_unique: {
        fields: ["userId", "productId"],
      },
    },
  }
);

module.exports = WishlistItem;
