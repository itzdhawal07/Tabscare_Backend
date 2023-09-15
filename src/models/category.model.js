const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/sequelize');
const { v4: uuidv4 } = require('uuid');

const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
        allowNull: false,
        unique: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true, // Add timestamps (createdAt and updatedAt)
});

module.exports = Category;