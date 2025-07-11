const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL to an external product image",
    },
    image_url_alt: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Alternate external image URL for hover effects",
    },
    uploaded_image_path: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Path/filename for an image uploaded to our own storage",
    },
    gender: {
      type: DataTypes.ENUM("Men", "Women", "Unisex"),
      allowNull: false,
      defaultValue: "Unisex",
    },
    main_category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

module.exports = Product;
