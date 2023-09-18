const responseHelper = require("../helpers/responseHelper");
const wishlistValidation = require("../validations/wishlist.validation");
const {
	SERVERERROR,
	SUCCESS,
	FAILURE,
} = require("../../config/key");

// Add to wishlist
const { User, Wishlist, Product, WishlistProduct } = require('../models');

exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user authentication middleware
        let reqParam = req.body;

        await Wishlist.sync({ force: false });
        await WishlistProduct.sync({ force: false });

        // Validate add to wishlist Request.
        let validationMessage = await wishlistValidation.addOrRemoveProductFromWishlistValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const productId = reqParam.productId;

        // Check if the product exists
        const product = await Product.findOne({
            where: {
                uuid: productId,
            },
        });

        if (!product) return responseHelper.error(res, res.__("Product not found"), FAILURE);

        // Check if the user already has the product in the wishlist
        let wishlist = await Wishlist.findOne({
            where: {
                userId: userId,
            },
        });

        if(!wishlist) {
            wishlist = await Wishlist.create({
                userId: userId,
            });
        }

        const wishlistProduct = await WishlistProduct.findOne({
            where: {
                wishlistId: wishlist.id, // Use the cart's ID instead of userId
                productId: product.id,
            },
        });

        if(wishlistProduct) {
            return responseHelper.successapi(res, res.__("Product is already available in the wishlist"), SUCCESS, wishlistProduct);
        }else {
            let wishlistProduct = await WishlistProduct.create({
                wishlistId: wishlist.id,
                productId: product.id,
            });
            return responseHelper.successapi(res, res.__("Product added to wishlist successfully"), SUCCESS, wishlistProduct);
        }
    } catch (error) {
        console.error(error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user authentication middleware
        let reqParam = req.body;

        // Validate add to wishlist Request.
        let validationMessage = await wishlistValidation.addOrRemoveProductFromWishlistValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const productUUID = reqParam.productId;

        // Find the product's primary key based on the UUID
        const product = await Product.findOne({
            where: {
                uuid: productUUID,
            },
        });

        if (!product) {
            return responseHelper.error(res, "Product not found", FAILURE);
        }

        // Check if the user already has the product in the wishlist
        let wishlist = await Wishlist.findOne({
            where: {
                userId: userId,
            },
        });

        if(!wishlist) return responseHelper.error(res, "User doesn't have any wishlist", FAILURE);

        // Check if the user has the product in their wishlistProduct
        const wishlistProduct = await WishlistProduct.findOne({
            where: {
                wishlistId: wishlist.id, // Use the cart's ID instead of userId
                productId: product.id,
            },
        });

        if(!wishlistProduct) return responseHelper.error(res, "Product not found in wishlist", FAILURE);

        // Remove the product from the user's wishlist
        await wishlistProduct.destroy();

        return responseHelper.successapi(res, "Product removed from wishlist successfully", SUCCESS);
    } catch (error) {
        console.error(error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.getAllWishlist = async (req, res) => {
    try{
        const userId = req.user.id; // Assuming you have user authentication middleware

        // Check if the user already has the product in the wishlist
        let wishlist = await Wishlist.findOne({
            where: {
                userId: userId,
            },
        });

        if(!wishlist) return responseHelper.error(res, "User doesn't have any wishlist", FAILURE);

        // Check if the user has the product in their wishlistProduct
        const wishlistProduct = await WishlistProduct.findAll({
            where: {
                wishlistId: wishlist.id, // Use the cart's ID instead of userId
            },
            raw : true
        });

        // Extract the product IDs from the wishlist items
        const productIds = wishlistProduct.map((item) => item.productId);

        console.log(productIds,'productIds');

        // Find the corresponding products for the extracted IDs
        const wishlistProducts = await Product.findAll({
            where: {
                id: productIds,
            },
        });

        return responseHelper.successapi(res, "Wishlist Products retrieved successfully", SUCCESS, wishlistProducts);
    }catch(error){
        // Error Response
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}