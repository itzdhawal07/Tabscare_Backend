const responseHelper = require("../helpers/responseHelper");
const orderValidation = require("../validations/order.validation");
const helper = require("../helpers/helper");
const {
	SERVERERROR,
	SUCCESS,
	FAILURE,
	ACTIVE_STATUS,
} = require("../../config/key");
const RazorpayService = require('../Services/Razorpay');
const { Cart, User, Order, Address, Product, CartItem, OrderProduct } = require('../models/index');
const shiprocket = require('../Services/Shiprocket');
var mail = require('../Services/Mailer');
let ejs = require("ejs");
const path = require("path");

exports.createRazorpayOrder = async (req, res) => {
    try {
        const reqParam = req.body;

        // Validate create order Request.
        const validationMessage = await orderValidation.createRazorpayOrderValidation(reqParam);
        if(validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const total = reqParam.total;
        
        // Prepare the data for the Razorpay API
        const data = {
            "amount": total * 100, // Amount in paise (INR)
            "currency": "INR"
        };

        // Call the createRazorpayOrder function from the service
        const razorpayOrderData = await RazorpayService.createRazorpayOrder(data);

        // Extract the Razorpay order ID from the response
        const razorpayOrderId = razorpayOrderData.id;

        // Send the response
        return responseHelper.successapi(res, res.__("RazorpayOrderCreated"), SUCCESS, razorpayOrderId);
    } catch (error) {
        console.log('error:', error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.createOrder = async (req, res) => {
    try {
        const reqParam = req.body;
        const userId = req.user.id;

        await Order.sync({ force: false });
        await OrderProduct.sync({ force: false });

        // Validate create order Request.
        const validationMessage = await orderValidation.createOrderValidation(reqParam);

        if(validationMessage) {
            return responseHelper.error(res, res.__(validationMessage), FAILURE);
        }

        // Check if the provided address belongs to the current user
        const user = await User.findByPk(userId, { raw : true });
        if(!user) return responseHelper.error(res, res.__("UserNotFound"), FAILURE);
        console.log(user,'user');

        let addresses = await Address.findAll({ where : { userId : user.id }, raw : true });
        console.log(addresses,'addresses');

        const address = addresses.find((addr) => addr.uuid === reqParam.addressId);
        if (!address) return responseHelper.error(res, res.__("AddressNotFound"), FAILURE);

        // Create the order
        const newOrder = {
            userId: userId,
            razorpayOrderId: req.body.razorpayOrderId,
            amount: parseFloat(req.body.amount),
            paymentMode: req.body.paymentMode,
            paymentStatus: req.body.paymentStatus,
            addressId: address.id
        };

        console.log(newOrder);

        const createdOrder = await Order.create(newOrder);
        if (!createdOrder) return responseHelper.error(res, res.__("OrderCreationFailed"), FAILURE);

        // Find the user's cart
        let userCart = await Cart.findOne({
            where: {
                userId: userId,
            },
        });

        // Create corresponding records in the OrderProduct table for each product in the order
        const orderProducts = [];

        for (const product of reqParam.products) {

            const productExists = await Product.findOne({ where : { uuid : product.product }});
            if (!productExists) return responseHelper.error(res, res.__("ProductNotFound"), FAILURE);

            orderProducts.push({
                orderId: createdOrder.id,
                productId: productExists.id,
                quantity: product.quantity,
                price: parseFloat(product.price),
            });

            if(userCart) {
                await CartItem.destroy({
                    where: {
                        cartId: userCart.id,
                        productId: productExists.id,
                    },
                });
            }
        }
        console.log(orderProducts);

        await OrderProduct.bulkCreate(orderProducts);

        return responseHelper.successapi(res, res.__("OrderCreatedSuccessfully"), SUCCESS, createdOrder);
    } catch (error) {
        console.log('error : ', error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.getOrderByUser = async (req, res) => {
    try{
        const userId = req.user.id;

       // Find all orders for the specific user, including associated user, address, and products
        const orders = await Order.findAll({
            where: {
                userId: userId,
            },
            include: [
                {
                    model: User,
                },
                {
                    model: Address,
                },
                {
                    model: OrderProduct, // Use the correct alias here
                    as: 'orderProducts',
                    include: [
                        {
                            model: Product,
                        },
                    ],
                },
            ],
        });

        if(orders && orders.length > 0) {
            return responseHelper.successapi(res, res.__("User wise Orders fetched successfully"), SUCCESS, orders);
        }else {
            return responseHelper.error(res, res.__("Order not found for given user"), FAILURE);
        }
    }catch(error){
        console.log('error : ', error);
        return responseHelper.error(res,res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.getOrderDetails = async (req, res) => {
    try{
        let reqParam = req.body;
        const userId = req.user.id;

        // Validate get order detail Request.
        let validationMessage = await orderValidation.getOrderDetailValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Find the order by orderId and userId
        const order = await Order.findOne({
            where: {
                uuid: reqParam.orderId,
                userId: userId,
            },
            include: [
                {
                    model: User,
                },
                {
                    model: Address,
                },
                {
                    model: OrderProduct,
                    as: 'orderProducts',
                    include: [
                        {
                            model: Product,
                        },
                    ],
                },
            ],
        });

        if (!order) {
            return responseHelper.error(res, res.__('Order data not found'), FAILURE);
        }

        // sucess response
        return responseHelper.successapi(res, res.__("OrderDetailFetchedSuccessfully"),SUCCESS, order);
    }catch(error){
        console.log('error : ', error);
        return responseHelper.error(res,res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.confirmOrder = async (req, res) => {
    try{
        let reqParam = req.body;
        const userId = req.user.id;

        // Validate confirm order Request.
        let validationMessage = await orderValidation.confirmOrderValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Find the order by orderId and userId
        let order = await Order.findOne({
            where: {
                uuid: reqParam.orderId,
                userId: userId,
            },
            include: [
                {
                    model: User,
                },
                {
                    model: Address,
                },
                {
                    model: OrderProduct,
                    as: 'orderProducts',
                    include: [
                        {   
                            model: Product,
                        },
                    ],
                },
            ],
        });

        if(!order) {
            return responseHelper.error(res, res.__('Order data not found'), FAILURE);
        }

        // Convert the order to JSON
        order = order.toJSON();

        // Call the Shiprocket API to create a custom order
        const shiprocketResponse = await shiprocket.createShiprocketCustomOrder(order);

        // Update the order with the Shiprocket shipment ID
        await Order.update(
            {
                shiprocketShipmentId: shiprocketResponse.order_id,
            },
            {
                where: {
                    id: order.id,
                },
            }
        );

        const customer = order.User;

        if (customer && customer.email) {
            // Prepare data for the email
            const productData = order.orderProducts.map((item) => ({
                productName: item.Product?.name,
                itemPrice: item.Product.price,
                quantity: item.quantity,
                totalAmount: item.price * item.quantity,
            }));

            const emailBody = await ejs.renderFile(
                path.join(__dirname, "../views/orderInvoice", "invoice.ejs"),
                {
                    locals: {
                        orderId: order.uuid,
                        customerName: customer?.firstname,
                        products: productData,
                        subtotal: 0,
                        discount: 0,
                        deliveryCharge: 0,
                        gst: 0,
                        total: order.amount
                    }
                },
            );

            // Send an email to the customer with the order invoice
            await mail.sendMailToCustomer(customer.email, emailBody, `Order Invoice (ID : ${order.uuid})`);
        }
        return responseHelper.successapi(res,  res.__('Shipment order created successfully'), SUCCESS, order);
    }catch(error){
        console.log('error : ', error);
        return responseHelper.error(res,res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.trackOrder = async (req, res) => {
    try{
        let reqParam = req.body;

        // Validate track order Request.
        let validationMessage = await orderValidation.trackOrderValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const orderStatus = await shiprocket.trackShiprocketOrderStatus(reqParam.shipmentId);

        // sucess response
        return responseHelper.successapi(res, res.__("Shipment order tracked successfully"),SUCCESS, orderStatus);
    }catch(error){
        console.log('error : ', error);
        return responseHelper.error(res,res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.getAllOrders = async (req, res) => {
    try{
        // Find all orders, including associated user, address, and products
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                },
                {
                    model: Address,
                },
                {
                    model: OrderProduct,
                    as: 'orderProducts',
                    include: [
                        {
                            model: Product,
                        },
                    ],
                },
            ],
        });

        if(orders && orders.length > 0) {
            return responseHelper.successapi(res, "All Orders fetched successfully", SUCCESS, orders);
        }else {
            return responseHelper.error(res, "Order not found", FAILURE);
        }
    }catch(error){
        console.log('error : ', error);
        return responseHelper.error(res,res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};