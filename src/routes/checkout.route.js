const express = require("express");
const router = express.Router();
const { verifyAuthToken } = require("../middleware/verifyToken");
const checkoutController = require("../controller/checkout.controller");

router.post("/", verifyAuthToken, checkoutController.handleCheckout);

module.exports = router;