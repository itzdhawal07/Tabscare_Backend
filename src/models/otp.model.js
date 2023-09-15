const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/sequelize');
const { v4: uuidv4 } = require('uuid');
const User = require('./user.model');

const OTP = sequelize.define("OTP", {
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
    otp: {
        type: DataTypes.STRING(6), // Six-digit string
        allowNull: false,
    },
    otpStartTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    otpEndTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'OPEN',
        validate: {
            isIn: [['OPEN', 'VERIFIED', 'EXPIRED']],
        }
    }
});

module.exports = OTP;