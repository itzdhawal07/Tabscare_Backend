const express = require("express");
const router = express.Router();
const { verifyAuthToken } = require("../middleware/verifyToken");
const orderController = require("../controller/order.controller");

router.post("/create-razorpay-order", verifyAuthToken, orderController.createRazorpayOrder);
router.post("/create-order", verifyAuthToken, orderController.createOrder);
router.get("/my-orders", verifyAuthToken, orderController.getOrderByUser);
router.post("/details", verifyAuthToken, orderController.getOrderDetails);
router.post("/confirm-order", verifyAuthToken, orderController.confirmOrder);
router.post("/track-order", verifyAuthToken, orderController.trackOrder);
router.get("/get-all-orders", verifyAuthToken, orderController.getAllOrders);

module.exports = router;