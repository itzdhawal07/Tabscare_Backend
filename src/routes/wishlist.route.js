const express = require("express");
const router = express.Router();
const { verifyAuthToken } = require("../middleware/verifyToken");
const wishlistController = require("../controller/wishlist.controller");

router.post("/add-to-wishlist", verifyAuthToken, wishlistController.addToWishlist);
router.delete("/remove-from-wishlist", verifyAuthToken, wishlistController.removeFromWishlist);
router.get("/get-all-wishlist", verifyAuthToken, wishlistController.getAllWishlist);

module.exports = router;