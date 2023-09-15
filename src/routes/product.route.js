const express = require("express");
const router = express.Router();
const { verifyAuthToken } = require("../middleware/verifyToken");
const productController = require("../controller/product.controller");

router.post("/create", verifyAuthToken, productController.createProduct);
router.get("/get-all", productController.getAllProduct);
router.get("/:id", productController.getProductById);
router.delete("/:id", verifyAuthToken, productController.deleteProduct);

module.exports = router;