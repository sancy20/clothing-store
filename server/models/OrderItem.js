const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price_at_purchase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    color_at_purchase: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size_at_purchase: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    timestamps: false,
  }
);

module.exports = OrderItem;
