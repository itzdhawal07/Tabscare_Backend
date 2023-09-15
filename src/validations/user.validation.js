// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");
const helper = require("../helpers/helper");

module.exports = {
	async getUserByIdValidation(req) {
		const schema = Joi.object({
			id: Joi.string().guid().required()
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},
	async updateUserValidation(req) {
		const schema = Joi.object({
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			dob: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
			gender: Joi.string().valid('male', 'female', 'other').required(),
			email: Joi.string().email().required(),
			password: Joi.string().optional()
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},
	async verifyOtpValidation(req) {
		const schema = Joi.object({
			otp : Joi.string().required(),
			mobile: Joi.string().required(),
			deviceId: Joi.string().optional()
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	}
};
