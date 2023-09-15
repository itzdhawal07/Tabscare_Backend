const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/sequelize');

const ProductImage = sequelize.define("ProductImage", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Add timestamps (createdAt and updatedAt)
});

module.exports = ProductImage;