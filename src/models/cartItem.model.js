const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/sequelize');

const CartItem = sequelize.define("CartItem", {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
});

module.exports = CartItem;