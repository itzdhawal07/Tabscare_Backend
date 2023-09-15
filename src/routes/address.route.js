const express = require("express");
const router = express.Router();
const addressController = require("../controller/address.controller");
const { verifyAuthToken } = require("../middleware/verifyToken");

router.post("/add", verifyAuthToken, addressController.addAddress);
// router.post("/remove", verifyAuthToken, addressController.removeAddress);
router.get("/getAll", verifyAuthToken, addressController.getAllAddresses);
router.get("/:id", verifyAuthToken, addressController.getSingleAddress);
router.post("/update/:id", verifyAuthToken, addressController.updateAddress);
router.delete("/delete/:id", verifyAuthToken, addressController.deleteAddress);

module.exports = router;