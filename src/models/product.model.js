const { DataTypes } = require('sequelize');
const { sequelize } = require('../connections/sequelize');
const { v4: uuidv4 } = require('uuid');

const Product = sequelize.define("Product", {
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
    sku_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    schedule: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    manufacturing_company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    manufacturer_address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    salt_composition: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    medicine_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stock: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    introduction: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ingredients: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    benefits: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    how_to_use: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    safety_advice: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    if_miss: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    packaging: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mrp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    discount: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gst: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    prescription_required: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fact_box: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    primary_use: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    salt_synonyms: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    storage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    use_of: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    common_side_effect: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alcohol_interaction: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pregnancy_interaction: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lactation_interaction: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    driving_interaction: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    kidney_interaction: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    liver_interaction: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otherDrugs_interaction: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_of_origin: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true, // Add timestamps (createdAt and updatedAt)
});

module.exports = Product;