const responseHelper = require("../helpers/responseHelper");
const manufacturerValidation = require("../validations/manufacturer.validation");
const {
	SERVERERROR,
	SUCCESS,
	FAILURE,
	ACTIVE_STATUS,
} = require("../../config/key");
const { Manufacturer } = require('../models/index');

exports.createManufacturer = async (req, res) => {
    try{
        // Check if the Manufacturer table exists and create it if not
        await Manufacturer.sync({ force: false });

        const reqParam = req.body;

        // Validate create category Request.
        let validationMessage = await manufacturerValidation.createManufacturerValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Check if a category with the same title already exists
        const existingManufacturer = await Manufacturer.findOne({
            where: {
                name: reqParam.name,
            },
        });

        if(existingManufacturer) return responseHelper.error(res, res.__("Manufacturer with the same name already exists"), FAILURE);

        // Create a new user instance
        const newManufacturer = Manufacturer.build({
            name: reqParam.name,
            address: reqParam.address,
        });

        // Save the user to the database
        await newManufacturer.save();
        // let createdCategory = newCategory.toJSON();

        // // Now you can access the id assigned by the database
        // console.log('Saved Category:', createdCategory);

        // Success Response
        return responseHelper.successapi(res, res.__("categoryCreatedSuccessfully"), SUCCESS, newManufacturer);
    }catch(error){
        // Error Response
        console.log(error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.getAllManufacturer = async (req, res) => {
    try {
        const manufacturers = await Manufacturer.findAll();

        if(manufacturers && manufacturers.length > 0) {
            return responseHelper.successapi(res, res.__("Manufacturers retrieved successfully"), SUCCESS, manufacturers);
        }else {
            return responseHelper.successapi(res, res.__("No prescriptions found"), SUCCESS, []);
        }
    } catch (err) {
        console.log(err);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};