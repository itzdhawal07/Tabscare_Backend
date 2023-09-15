const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/sequelize');
const { v4: uuidv4 } = require('uuid');

const Prescription = sequelize.define("Prescription", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Prescription;