const responseHelper = require("../helpers/responseHelper");
const userValidation = require("../validations/user.validation");
const { User } = require('../models/index');
const {
    SERVERERROR,
    UNAUTHORIZED,
    SUCCESS,
    FAILURE,
    ACTIVE_STATUS,
    JWT_AUTH_TOKEN_SECRET,
    JWT_EXPIRES_IN,
    APP_WEB_LINK,
    DELETED_STATUS,
    CRYPTO_SECRET
} = require("../../config/key");
const CryptoJs = require('crypto-js');

// get user details by Id
exports.getUseById = async (req, res) => {
    try {
        // Get the user ID from the request parameters
        const userId = req.params.id;

        // Validate get user by id Request.
        let validationMessage = await userValidation.getUserByIdValidation({ id : userId});
        if(validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Perform a database query to fetch the user by ID
        const findUser = await User.findOne({ where: { uuid: userId } });

        // Check if the user exists
        if(!findUser) return responseHelper.error(res, "User not found", FAILURE);

        // Send a success response with the user data
        return responseHelper.successapi(res, "User retrieved successfully", SUCCESS, findUser);
    } catch (e) {
        console.log(e);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = req.user;
        const reqParam = req.body;

        // Validate the update user request
        let validationMessage = await userValidation.updateUserValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__("validationMessage"), FAILURE);

        // Use Sequelize to find the user by ID
        const existingUser = await User.findByPk(user.id);

        if (!existingUser) {
            // User not found, return error message
            return responseHelper.error(res, res.__("User not found"), FAILURE);
        };

        // Update the user
        await existingUser.update({
            firstName: reqParam.firstName,
            lastName: reqParam.lastName,
            dob: reqParam.dob,
            gender: reqParam.gender,
            email: reqParam.email,
            password: reqParam.password ? CryptoJs.AES.encrypt(reqParam.password,CRYPTO_SECRET).toString() : existingUser.password
        });

        // Send a success response with the updated user data
        return responseHelper.successapi(res, "User updated successfully", SUCCESS, existingUser);
    } catch (error) {
        console.log(error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by their ID
        const user = await User.findOne({
            where: {
                uuid: userId,
            },
        });

        if (!user) {
            // If the user is not found, return an appropriate message
            return responseHelper.error(res, "User not found", FAILURE);
        }

        // Delete the user
        await user.destroy();

        // Success Response
        return responseHelper.successapi(res, "User deleted successfully", SUCCESS);
    } catch (error) {
        console.log(error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};