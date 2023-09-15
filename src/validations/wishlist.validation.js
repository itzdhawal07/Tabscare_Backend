// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");
const helper = require("../helpers/helper");

module.exports = {
	async addOrRemoveProductFromWishlistValidation(req) {
		const schema = Joi.object({
			productId: Joi.string().guid().required(),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	}
};
