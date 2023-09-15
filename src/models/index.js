// models/index.js
const { sequelize } = require('../connections/sequelize');

// Import and define all your models here
const User = require('./user.model');
const Address = require('./address.model');
const Cart = require('./cart.model');
const CartItem = require('./cartItem.model');
const Order = require('./order.model');
const Product = require('./product.model');
const Category = require('./category.model');
const Subcategory = require('./subcategory.model');
const OTP = require('./otp.model');
const Prescription = require('./prescription.model');
const ProductImage = require('./productImage.model');
const OrderProduct = require('./orderProduct.model');
const Wishlist = require('../models/wishlist.model');
const WishlistProduct = require('../models/wishlistProduct.model');

// Define associations here
User.hasMany(Address, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    as:'addresses'
});

User.hasOne(Cart, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
});

User.hasMany(Order, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
});

User.hasMany(OTP, {
    foreignKey: 'userId',
    onDelete: 'CASCADE', // Delete associated OTPs if the user is deleted
});

User.hasMany(Prescription, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
});

User.hasOne(Wishlist, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
});

// Define associations
Address.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
});

// Define associations
Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE', // If the associated category is deleted, also delete the product
});

Product.belongsTo(Subcategory, {
    foreignKey: 'subCategoryId',
    onDelete: 'CASCADE', // If the associated subcategory is deleted, also delete the product
});

Product.belongsToMany(Cart, {
    through: CartItem,
    foreignKey: 'productId',
    onDelete: 'CASCADE', // Delete associated cart items if the product is deleted
});

Product.belongsToMany(Wishlist, {
    through: WishlistProduct,
    foreignKey: 'productId',
    onDelete: 'CASCADE', // Delete associated cart items if the product is deleted
});

Product.belongsToMany(Order, {
    through: OrderProduct,
    foreignKey: 'productId',
    onDelete: 'CASCADE',
});

Product.hasMany(ProductImage, {
    foreignKey: 'productId',
    onDelete: 'CASCADE'
});

// Define associations
Order.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
});

Order.hasMany(OrderProduct, {
    foreignKey: 'orderId', // This should match the foreign key in the OrderProduct model
    onDelete: 'CASCADE',
    as: 'orderProducts',
});

Order.belongsTo(Address, {
    foreignKey: 'addressId',
    onDelete: 'CASCADE',
});

Order.belongsToMany(Product, {
    through: OrderProduct, // This is a junction table for the many-to-many relationship
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    // as: 'orderProducts'
});

Category.hasMany(Product, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE', // Delete associated products if category is deleted
});

Category.hasMany(Subcategory, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE', // Delete associated subcategories if category is deleted
});

Subcategory.belongsTo(Category, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE', // If the associated category is deleted, also delete the subcategory
});

Subcategory.hasMany(Product, {
    foreignKey: 'subCategoryId',
    onDelete: 'CASCADE', // If the associated category is deleted, also delete the subcategory
});

OTP.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE', // Delete associated OTP if the user is deleted
});

Prescription.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE', // Delete associated prescriptions if the user is deleted
});

Cart.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE', // Delete associated cart if the user is deleted
});

Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
    onDelete: 'CASCADE',
    as: 'cartItems', // Define an alias for the association
});

CartItem.belongsTo(Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE', // Delete associated cart item if the product is deleted
});

CartItem.belongsTo(Cart, {
    foreignKey: 'cartId', // Match the name of the primary key in the Cart model
    onDelete: 'CASCADE',
});

WishlistProduct.belongsTo(Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE', // Delete associated cart item if the product is deleted
});

WishlistProduct.belongsTo(Wishlist, {
    foreignKey: 'wishlistId', // Match the name of the primary key in the Cart model
    onDelete: 'CASCADE',
});

Cart.belongsToMany(Product, {
    through: CartItem,
    foreignKey: 'cartId',
    onDelete: 'CASCADE', // Delete associated cart items if the cart is deleted
});

Wishlist.belongsToMany(Product, {
    through: WishlistProduct,
    foreignKey: 'wishlistId',
    onDelete: 'CASCADE', // Delete associated cart items if the cart is deleted
});

ProductImage.belongsTo(Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
});

OrderProduct.belongsTo(Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
});

OrderProduct.belongsTo(Order, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    // as:'orderProducts'
});

Wishlist.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

module.exports = {
    User,
    Address,
    Cart,
    Order,
    Product,
    Category,
    Subcategory,
    OTP,
    Prescription,
    CartItem,
    ProductImage,
    OrderProduct,
    Wishlist,
    WishlistProduct
};
