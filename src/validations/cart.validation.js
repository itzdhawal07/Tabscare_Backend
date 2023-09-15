// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");
const helper = require("../helpers/helper");

module.exports = {
	async addToCartValidation(req) {
		const schema = Joi.object({
			productId: Joi.string().guid().required(),
			quantity: Joi.number().integer().required().min(1)
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},

	async removeFromCartValidation(req) {
		const schema = Joi.object({
			productId: Joi.string().guid().required(),
			quantity: Joi.number().integer().required().min(0)
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},

	async deleteProductFromCartValidation(req) {
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
