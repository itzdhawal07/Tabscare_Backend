'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('categories', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isIn: [[true, false]],
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Define the migration to remove the 'isActive' column if needed
    await queryInterface.removeColumn('categories', 'isActive');
  }
};