'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('subcategories', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isIn: [[true, false]],
      },
    });
  },

  async down (queryInterface, Sequelize) {
    // Add migration code here to undo changes to the database
    await queryInterface.removeColumn('subcategories', 'isActive');
  }
};