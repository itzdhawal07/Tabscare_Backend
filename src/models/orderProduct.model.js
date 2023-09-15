const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/sequelize');
const { v4: uuidv4 } = require('uuid');

const OrderProduct = sequelize.define("OrderProduct", {
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
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    price: {
        type: DataTypes.FLOAT,
        defaultValue: 1,
    },
});

module.exports = OrderProduct;