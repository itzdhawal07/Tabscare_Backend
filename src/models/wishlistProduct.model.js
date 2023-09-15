const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/sequelize');

const WishlistProduct = sequelize.define("WishlistProduct", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
});

module.exports = WishlistProduct;