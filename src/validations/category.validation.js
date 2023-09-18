const Joi = require("joi");
const helper = require("../helpers/helper");

module.exports = {
	async createCategoryValidation(req) {
		const schema = Joi.object({
			title: Joi.string().required(),
			desc: Joi.string().required(),
			img: Joi.string().required()
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},

	async createSubCategoryValidation(req) {
		const schema = Joi.object({
			title: Joi.string().required(),
			desc: Joi.string().required(),
			img: Joi.string().required(),
			categoryId: Joi.string().guid().required(),
			isActive: Joi.boolean().required()
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},

	async getSingleCategoryOrSubCategoryValidation(req) {
		const schema = Joi.object({
			id: Joi.string().guid().required(),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},

	async getCategoryWiseSubCategoryValidation(req) {
		const schema = Joi.object({
			id: Joi.string().guid().required(),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},

	async createSubSubcategoryValidation(req) {
		const schema = Joi.object({
			title: Joi.string().required(),
			desc: Joi.string().required(),
			img: Joi.string().required(),
			subCategoryId: Joi.string().guid().required(),
			isActive: Joi.boolean().required()
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},

	async getSubCategoryWiseSubSubCategoryValidation(req) {
		const schema = Joi.object({
			id: Joi.string().guid().required(),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	},
};
