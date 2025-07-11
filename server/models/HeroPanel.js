const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HeroPanel = sequelize.define(
  "HeroPanel",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The brand name, used for the link (e.g., 'BAPE')",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "URL for the main panel background image",
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "URL for the brand logo image that appears on hover",
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "The order in which to display the panels (e.g., 1, 2, 3)",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Toggles whether this panel should be shown on the homepage",
    },
  },
  {
    tableName: "hero_panels",
    timestamps: true,
  }
);

module.exports = HeroPanel;
