'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove the 'manufacturing_company' and 'manufacturing_address' columns
    await queryInterface.removeColumn('products', 'manufacturer_address');

    // Add the 'subSubCategoryId' and 'manufacturerId' columns
    await queryInterface.addColumn('products', 'subSubCategoryId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'subsubcategories', // Make sure this matches your actual table name
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('products', 'manufacturerId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'manufacturers', // Make sure this matches your actual table name
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    // Undo the changes made in the 'up' function

    await queryInterface.addColumn('products', 'manufacturer_address', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn('products', 'subSubCategoryId');
    await queryInterface.removeColumn('products', 'manufacturerId');
  }
};