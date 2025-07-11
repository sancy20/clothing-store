const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
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
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shipping_address: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "shipped",
        "delivered",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    payment_method: {
      type: DataTypes.ENUM("khqr", "cod"),
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

module.exports = Order;
