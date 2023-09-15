const responseHelper = require("../helpers/responseHelper");
// const LanguageModel = require("../models/language.model");
const checkoutValidation = require("../validations/checkout.validation");
const {
	SERVERERROR,
	SUCCESS,
	FAILURE,
} = require("../../config/key");
const { Address, Cart, CartItem, Product } = require("../models/index");

exports.handleCheckout = async (req, res) => {
    try{
        let reqParam = req.body;
        const userId = req.user.id;

        // Validate add to cart Request.
        let validationMessage = await checkoutValidation.checkoutValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);


        // Find the user's address
        const address = await Address.findOne({
            where: {
                userId: userId,
                uuid: reqParam.addressId,
            },
        });

        if (!address) return responseHelper.error(res, res.__('Address not found'), FAILURE);

        // Find the user's cart
        const cart = await Cart.findOne({
            where: {
                userId: userId,
            }
        });

        console.log(cart,'cart');
        if(!cart) return responseHelper.error(res, res.__('Cart not found'), FAILURE);

        const cartItems = await CartItem.findAll({
            where: {
                cartId: cart.id,
            },
            include: [
                {
                    model: Product,
                }
            ],
            raw : true,
            nest: true
        })

        // Calculate cart details
        let price = 0;
        let discount = 0;
        let delivery = 0;

        for (const cartItem of cartItems) {
            const productPrice = parseFloat(cartItem.Product.mrp) || 0;
            price += productPrice * cartItem.quantity;
        }

        const total = price - discount + delivery;

        const cartDetails = {
            cartProducts: cartItems.map((cartItem) => ({
                product: cartItem.Product,
                quantity: cartItem.quantity,
                price: parseFloat(cartItem.Product.mrp) * cartItem.quantity,
            })),
            price: price,
            discount: discount,
            delivery: delivery,
            total: total,
        };

        const checkoutDetails = {
            address: address,
            cartDetails: cartDetails,
        };

        // Success Response
        return responseHelper.successapi(res, res.__("CheckoutCreatedSuccessfully"), SUCCESS, checkoutDetails);
    }catch(error){
        // Error Response
        console.log(error,'error');
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}