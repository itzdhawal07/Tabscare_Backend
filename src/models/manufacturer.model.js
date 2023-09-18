const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/sequelize');
const { v4: uuidv4 } = require('uuid');

const Manufacturer = sequelize.define("Manufacturer", {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        validate: {
            isIn: [[true, false]],
        }
    }
}, {
    timestamps: true, // Add timestamps (createdAt and updatedAt)
});

module.exports = Manufacturer;