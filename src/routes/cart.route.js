const express = require("express");
const router = express.Router();
const { verifyAuthToken } = require("../middleware/verifyToken");
const cartController = require("../controller/cart.controller");

router.post("/add", verifyAuthToken, cartController.addToCart);
router.post("/remove", verifyAuthToken, cartController.removeFromCart);
router.post("/delete", verifyAuthToken, cartController.deleteProductFromCart);
router.get("/get-all", verifyAuthToken, cartController.getAllCartProducts);

module.exports = router;