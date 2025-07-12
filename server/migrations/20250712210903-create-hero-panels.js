"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("HeroPanels", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      logoUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      displayOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("HeroPanels");
  },
};
