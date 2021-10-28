"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("comments", "createdAt", {
      type: Sequelize.DATE(6),
      allowNull: false,
    });
    await queryInterface.changeColumn("comments", "updatedAt", {
      type: Sequelize.DATE(6),
      allowNull: false,
    });
    await queryInterface.changeColumn("posts", "createdAt", {
      type: Sequelize.DATE(6),
      allowNull: false,
    });
    await queryInterface.changeColumn("posts", "updatedAt", {
      type: Sequelize.DATE(6),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("comments", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn("comments", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn("posts", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn("posts", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
