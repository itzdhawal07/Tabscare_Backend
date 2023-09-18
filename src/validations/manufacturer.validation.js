const Joi = require("joi");
const helper = require("../helpers/helper");

module.exports = {
	async createManufacturerValidation(req) {
		const schema = Joi.object({
			name: Joi.string().required(),
			address: Joi.string().min(10).required(),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error",error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	}
};