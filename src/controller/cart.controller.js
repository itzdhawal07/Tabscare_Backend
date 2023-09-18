const responseHelper = require("../helpers/responseHelper");
const cartValidation = require("../validations/cart.validation");
const {
	SERVERERROR,
	SUCCESS,
	FAILURE,
} = require("../../config/key");
const { Product, User, CartItem, Cart } = require('../models/index');

exports.addToCart = async (req, res) => {
    try {
        const reqParam = req.body;
        const userId = req.user.id;
        const productId = reqParam.productId;
        const quantity = reqParam.quantity;

        await Cart.sync({ force: false });
        await CartItem.sync({ force: false });

        // Validate add to cart Request.
        let validationMessage = await cartValidation.addToCartValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Find the user by their UUID
        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) return responseHelper.error(res, "User not found", FAILURE);

        // Find the product by its UUID
        const product = await Product.findOne({
            where: {
                uuid: productId,
            },
        });

        console.log(user,product);

        if (!product) {
            return responseHelper.error(res, "Product not found in inventory", FAILURE);
        }

        // Find the user's cart
        let userCart = await Cart.findOne({
            where: {
                userId: userId,
            },
        });

        if (!userCart) {
            // Create a new cart for the user if it doesn't exist
            userCart = await Cart.create({
                userId: userId,
            });
        }

        // Check if the product is already in the user's cart
        const cartItem = await CartItem.findOne({
            where: {
                cartId: userCart.id, // Use the cart's ID instead of userId
                productId: product.id,
            },
        });

        if(cartItem) {
            // Update the quantity of the existing cart item
            cartItem.quantity += quantity;
            await cartItem.save();

            return responseHelper.successapi(res, res.__("Product added to cart successfully"), SUCCESS, { cartItem });
        }else {
            // Create a new cart item
            let cartItem = await CartItem.create({
                cartId: userCart.id,
                productId: product.id,
                quantity: quantity,
            });

            return responseHelper.successapi(res, res.__("Product added to cart successfully"), SUCCESS, { cartItem });
        }

    }catch (error) {
        console.log('error : ', error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.removeFromCart = async (req, res) => {
    try {
        const reqParam = req.body;
        const userId = req.user.id;

        // Validate remove from cart Request.
        let validationMessage = await cartValidation.removeFromCartValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const productId = reqParam.productId;
        const quantity = reqParam.quantity;

        // Find the user by their UUID
        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) return responseHelper.error(res, res.__("User not found"), FAILURE);

        // Find the product by its UUID
        const product = await Product.findOne({
            where: {
                uuid: productId,
            },
        });

        if (!product) {
            return responseHelper.error(res, "Product not found in inventory", FAILURE);
        }

        // Find the user's cart
        let userCart = await Cart.findOne({
            where: {
                userId: userId,
            },
        });

        if(!userCart) return responseHelper.error(res, res.__("User doesn't have any product in cart"), FAILURE);

        // Find the cart item
        const cartItem = await CartItem.findOne({
            where: {
                cartId: userCart.id,
                productId: product.id,
            },
        });

        if (!cartItem) {
            return responseHelper.error(res, res.__("Product not found in cart"), FAILURE);
        }

        if(cartItem.quantity > 1 && cartItem.quantity > quantity) {
            cartItem.quantity -= quantity;
            await cartItem.save();
        } else {
            await cartItem.destroy();
        }

        return responseHelper.successapi(res, res.__("Product removed from cart successfully"), SUCCESS, cartItem);
    } catch (error) {
        console.log('error : ', error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.deleteProductFromCart = async (req, res) => {
    try {
        const reqParam = req.body;
        const userId = req.user.id;

        // Validate delete product from cart Request.
        let validationMessage = await cartValidation.deleteProductFromCartValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const productId = reqParam.productId;

        // Find the user by their primary key id
        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return responseHelper.error(res, res.__("User not found"), FAILURE);
        }

        // Find the product by its UUID
        const product = await Product.findOne({
            where: {
                uuid: productId,
            },
        });

        if (!product) {
            return responseHelper.error(res, res.__("Product not found in inventory"), FAILURE);
        }

        // Find the user's cart
        let userCart = await Cart.findOne({
            where: {
                userId: userId,
            },
        });

        if(!userCart) return responseHelper.error(res, res.__("User doesn't have any product in cart"), FAILURE);

        // Find the cart item
        const cartItem = await CartItem.findOne({
            where: {
                cartId: userCart.id,
                productId: product.id,
            },
        });

        if(!cartItem) {
            return responseHelper.error(res, res.__("Product not found in cart"), FAILURE);
        }

        await cartItem.destroy();

        return responseHelper.successapi(res, res.__("Product removed from cart successfully"), SUCCESS);
    } catch (error) {
        console.log('error : ', error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.getAllCartProducts = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user by their primary key id
        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return responseHelper.error(res, res.__("User not found"), FAILURE);
        }

         // Find the user's cart
        let userCart = await Cart.findOne({
            where: {
                userId: userId,
            },
        });

        if(!userCart) return responseHelper.error(res, res.__("User doesn't have any product in cart"), FAILURE);

        // Find all cart items for the user
        const cartItems = await CartItem.findAll({
            where: {
                cartId: userCart.id,
            },
            include: Product, // Include the associated Product model
        });

        const cartProducts = [];
        let price = 0;

        for (const cartItem of cartItems) {
            const product = cartItem.Product; // Access the associated Product

            if (product) {
                const cartProduct = {
                    "product": product,
                    "quantity": cartItem.quantity,
                    "price": (parseFloat(product.mrp) * cartItem.quantity).toFixed(2),
                };
                cartProducts.push(cartProduct);
                price += parseFloat(product.mrp) * cartItem.quantity;
            }
        }

        const cartDetails = {
            "cartProducts": cartProducts,
            "price": price.toFixed(2),
        };

        return responseHelper.successapi(res, res.__("Cart products retrieved successfully"), SUCCESS, cartDetails);
    } catch (error) {
        console.log('error : ', error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};