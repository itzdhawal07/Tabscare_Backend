const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/sequelize');
const { v4: uuidv4 } = require('uuid');

const Order = sequelize.define("Order", {
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
    razorpayOrderId: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    paymentMode: {
        type: DataTypes.STRING,
        defaultValue: "COD",
        validate: {
            isIn: [['COD', 'ONLINE']],
        },
    },
    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: "PENDING",
        validate: {
            isIn: [['PENDING', 'DONE']],
        },
    },
    deliveryStatus: {
        type: DataTypes.STRING,
        defaultValue: "PENDING",
        validate: {
            isIn: [['PENDING', 'DISPATCHED', 'DELIVERED']],
        },
    },
    shiprocketShipmentId: {
        type: DataTypes.STRING,
        defaultValue: "",
    }
}, {
    timestamps: true,
});

module.exports = Order;