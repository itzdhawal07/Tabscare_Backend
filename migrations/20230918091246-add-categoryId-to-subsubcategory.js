'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add the 'categoryId' columns
    await queryInterface.addColumn('subsubcategories', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'categories', // Make sure this matches your actual table name
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('subsubcategories', 'categoryId');
  }
};