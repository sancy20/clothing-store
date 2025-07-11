const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductImage = sequelize.define(
  "ProductImage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color_hint: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment:
        "Hint to associate image with a specific color variant, e.g., 'Black'",
    },
  },
  {
    tableName: "product_images",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

module.exports = ProductImage;
