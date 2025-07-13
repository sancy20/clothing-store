"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "image_url", {
      type: Sequelize.STRING,
      comment: "URL to an external product image",
    });
    await queryInterface.addColumn("products", "image_url_alt", {
      type: Sequelize.STRING,
      comment: "Alternate external image URL for hover effects",
    });
    await queryInterface.addColumn("products", "uploaded_image_path", {
      type: Sequelize.STRING,
      comment: "Path/filename for an image uploaded to our own storage",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "image_url");
    await queryInterface.removeColumn("products", "image_url_alt");
    await queryInterface.removeColumn("products", "uploaded_image_path");
  },
};
