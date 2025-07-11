const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductVariant = sequelize.define(
  "ProductVariant",
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
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "product_variants",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

module.exports = ProductVariant;
