const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/sequelize');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define("User", {
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
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'CUSTOMER',
        validate: {
            isIn: [['DOCTOR', 'PHARMACIST', 'VENDOR', 'ADMIN', 'DELIVERYBOY','CUSTOMER']],
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['male', 'female', 'other']],
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        validate: {
            isIn: [[true, false]],
        }
    }
},{
    // Add timestamps (createdAt and updatedAt)
    timestamps: true,
});

// // Define a method to transform the user object before sending in the response
// User.prototype.toJSONCustom = function () {
//     const values = { ...this.get() };
//     delete values.id; // Exclude the 'id' field
//     return values;
// };

module.exports = User;