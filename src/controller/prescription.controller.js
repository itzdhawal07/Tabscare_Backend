const responseHelper = require("../helpers/responseHelper");
const jwt = require("jsonwebtoken");
const {
  SERVERERROR,
  SUCCESS,
  FAILURE
} = require("../../config/key");
const { Prescription } = require("../models/index");
const { uploadFile } = require("../Services/FileUpload");

exports.uploadPrescription = async (req, res) => {
  try {
    // Sync the Prescription table to ensure it exist
    await Prescription.sync({ force: false });

    if (!req.file) {
      return responseHelper.error(res, res.__("FileIsMissing"), FAILURE);
    }

    const userId = req.user.id; // Assuming you have user authentication middleware
    const imagePath = req.file.path;
    const imageOriginalName = req.file.originalname;

    // Handle the file upload logic here
    const imageURL = await uploadFile(imagePath, imageOriginalName, userId);

    // Example using Sequelize:
    const newPrescription = await Prescription.create({
      userId: userId,
      img: imageURL,
    });

    if(newPrescription) {
      // Prescription record created successfully
      return responseHelper.successapi(res, res.__("PrescriptionUploadedSuccessfully"), SUCCESS, newPrescription);
    } else {
      return responseHelper.error(res, res.__("Failed to create prescription record"), FAILURE);
    }
  } catch (error) {
    console.error(error);
    return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
  }
};

exports.getPrescriptionByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find prescriptions by user ID
    const prescriptions = await Prescription.findAll({
      where: {
        userId: userId,
      }
    });

    if (prescriptions && prescriptions.length > 0) {
      return responseHelper.successapi(res, res.__("Prescriptions retrieved successfully"), SUCCESS, prescriptions);
    }else {
      return responseHelper.successapi(res, res.__("No prescriptions found"), SUCCESS, []);
    }
  } catch (e) {
    console.log(err);
    return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
  }
};

exports.getAllPrescription = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll();

    if(prescriptions && prescriptions.length > 0) {
      return responseHelper.successapi(res, res.__("Prescriptions retrieved successfully"), SUCCESS, prescriptions);
    }else {
      return responseHelper.successapi(res, res.__("No prescriptions found"), SUCCESS, []);
    }
  } catch (err) {
    console.log(err);
    return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
  }
};