const responseHelper = require("../helpers/responseHelper");
const addressValidation = require("../validations/address.validation");
const {
    SERVERERROR,
    SUCCESS,
    FAILURE
} = require("../../config/key");
const { Address } = require("../models/index");

exports.addAddress = async (req, res) => {
    try {
        const user = req.user;
        const reqParam = req.body;

        // Sync the Address table to ensure it exist
        await Address.sync({ force: false });

        // Validate add address Request.
        let validationMessage = await addressValidation.addOrUpdateAddressValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Check if the address already exists for the user
        const existingAddress = await Address.findOne({
            where: {
                userId: user.id,
                customerEmail: reqParam.customerEmail,
            },
        });

        if(existingAddress) {
            return responseHelper.error(res, res.__("Address already exists for this user with given mail id"), FAILURE);
        }

        // Create a new address entry
        const newAddress = await Address.create({
            userId: user.id,
            customerName: reqParam.customerName,
            customerMobile: reqParam.customerMobile,
            customerEmail: reqParam.customerEmail,
            type: reqParam.type,
            line1: reqParam.line1,
            line2: reqParam.line2 || null,
            postalCode: reqParam.postalCode,
            city: reqParam.city,
            state: reqParam.state,
            country: reqParam.country
        });

        return responseHelper.successapi(res, res.__("Success"), SUCCESS, newAddress);
    }catch(e){
        console.log(e,"error")
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.removeAddress = async (req, res) => {
    try {
        const user = req.user;

        return responseHelper.successapi(res, res.__("Success"), SUCCESS, savedChat );
    }catch(e){
        console.log(e,"error")
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.getAllAddresses = async (req, res) => {
    try {
        const user = req.user;

        // Find all addresses with the matching userId
        const addresses = await Address.findAll({
            where: {
                userId: user.id,
            },
            raw: true
        });

        if (addresses && addresses.length > 0) {
            return responseHelper.successapi(res, res.__("User Addressess retrieved successfully"), SUCCESS, addresses);
        }else {
            return responseHelper.successapi(res, res.__("address not found"), SUCCESS, []);
        }
    }catch(e){
        console.log(e,"error")
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.getSingleAddress = async (req, res) => {
    try {
        const user = req.user;
        const addressId = req.params.id;

        // Find all addresses with the matching userId
        const address = await Address.findOne({
            where: {
                userId: user.id,
                uuid: addressId
            },
        });

        if (!address) {
            return responseHelper.error(res, res.__("address not found"), FAILURE);
        }else {
            return responseHelper.successapi(res, res.__("User Address retrieved successfully"), SUCCESS, address);
        }        
    }catch(e){
        console.log(e,"error")
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.updateAddress = async (req, res) => {
    try {
        const user = req.user;
        const addressId = req.params.id;
        const reqParam = req.body;

        // Validate update address Request.
        let validationMessage = await addressValidation.addOrUpdateAddressValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__("validationMessage"), FAILURE);

        // Find the address by ID and ensure it belongs to the authenticated user
        const address = await Address.findOne({
            where: {
                userId: user.id,
                uuid: addressId,
            },
        });

        if (!address) {
            return responseHelper.error(res, res.__("Address not found"), FAILURE);
        }

        // Update the address
        await address.update({
            customerName: reqParam.customerName,
            customerMobile: reqParam.customerMobile,
            customerEmail: reqParam.customerEmail,
            type: reqParam.type,
            line1: reqParam.line1,
            line2: reqParam.line2,
            postalCode: reqParam.postalCode,
            city: reqParam.city,
            state: reqParam.state,
            country: reqParam.country,
        });
        
        return responseHelper.successapi(res, res.__("Address updated successfully"), SUCCESS, address );
    }catch(e){
        console.log(e,"error")
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.deleteAddress = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id;
        const addressId = req.params.id;

        // Find the address associated with the user
        const address = await Address.findOne({
            where: {
                uuid: addressId,
                userId: userId
            }
        });

        if (!address) {
            return responseHelper.error(res, res.__("Address not found"), FAILURE);
        }

        // Remove the address
        await address.destroy();
        
        return responseHelper.successapi(res, res.__("Address removed successfully"), SUCCESS );
    }catch(e){
        console.log(e,"error")
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}