const express = require("express");
const router = express.Router();
const { verifyAuthToken } = require("../middleware/verifyToken");
const manufacturerController = require("../controller/manufacturer.controller");

router.post("/create-manufacturer", verifyAuthToken, manufacturerController.createManufacturer);
router.get("/get-all-manufacturer", verifyAuthToken, manufacturerController.getAllManufacturer);

module.exports = router;