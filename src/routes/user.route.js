const express = require("express");
const router = express.Router();
const { verifyAuthToken } = require("../middleware/verifyToken");
const userController = require("../controller/user.controller");

router.get("/:id", verifyAuthToken, userController.getUseById);
router.put("/update-user", verifyAuthToken, userController.updateUser);
router.delete("/:id", verifyAuthToken, userController.deleteUserById);

module.exports = router;