const Joi = require("joi");
const helper = require("../helpers/helper");

module.exports = {
    async addOrUpdateAddressValidation(req){
        const schema = Joi.object({
            customerName: Joi.string().required(),
            customerMobile: Joi.string().length(10).required(),
            customerEmail: Joi.string().email().required(),
            type: Joi.string().valid('home', 'work').required(),
            line1: Joi.string().min(6).required(),
            line2: Joi.string().optional(),
            postalCode: Joi.string().length(6).required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().required(),
        }).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
			return helper.validationMessageKey("validation", error);
		}
		return null;
    }
}