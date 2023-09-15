// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");
const helper = require("../helpers/helper");
let ejs = require("ejs");
var mail = require("../Services/Mailer");
const path = require("path");

module.exports = {
	async createRazorpayOrderValidation(req) {
		const schema = Joi.object({
			total: Joi.number().integer().required().min(1),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},

	async createOrderValidation(req) {
		const schema = Joi.object({
			razorpayOrderId: Joi.string().required(),
			products: Joi.array().min(1).items(
				Joi.object({
					product: Joi.string().guid().required(),
					quantity: Joi.number().integer().min(1).required(),
					price: Joi.number().min(0).required()
				})
			).required(),
			amount: Joi.number().min(0).required(),
			paymentMode: Joi.string().valid('ONLINE').required(),
			paymentStatus: Joi.string().valid('DONE').required(),
			addressId: Joi.string().guid().required(),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},

	async getOrderDetailValidation(req) {
		const schema = Joi.object({
			orderId: Joi.string().guid().required(),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},

	async confirmOrderValidation(req) {
		const schema = Joi.object({
			orderId: Joi.string().guid().required(),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},

	async trackOrderValidation(req) {
		const schema = Joi.object({
			shipmentId: Joi.number().integer().required().min(1),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	}
};
