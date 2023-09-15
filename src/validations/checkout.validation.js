// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");
const helper = require("../helpers/helper");

module.exports = {
	async checkoutValidation(req) {
		const schema = Joi.object({
			addressId: Joi.string().guid().required(),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	}
};
