const express = require("express");
const router = express.Router();
const { verifyAuthToken } = require("../middleware/verifyToken");
const prescriptionController = require("../controller/prescription.controller");
const upload = require("../middleware/upload");

router.post("/upload", verifyAuthToken, upload.single('image'), prescriptionController.uploadPrescription);
router.get("/get-prescription-by-user", verifyAuthToken, prescriptionController.getPrescriptionByUser);
router.get("/all", verifyAuthToken, prescriptionController.getAllPrescription);

module.exports = router;