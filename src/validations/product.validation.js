// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");
const helper = require("../helpers/helper");

module.exports = {
	async createProductValidation(req) {
		const schema = Joi.object({
			products: Joi.array()
				.min(1)
				.items(
					Joi.object({
						sku_code: Joi.string().required(),
						name: Joi.string().required(),
						images: Joi.array().min(1).items(Joi.string()).required(),
						categoryId: Joi.string().guid().required(),
						subCategoryId: Joi.string().guid().required(),
						schedule: Joi.string().required(),
						manufacturing_company: Joi.string().required(),
						manufacturer_address: Joi.string().required(),
						salt_composition: Joi.string().required(),
						medicine_type: Joi.string().required(),
						stock: Joi.number().integer().min(0).required(),
						introduction: Joi.string().required(),
						ingredients: Joi.string().required(),
						benefits: Joi.string().required(),
						description: Joi.string().required(),
						how_to_use: Joi.string().required(),
						safety_advice: Joi.string().required(),
						if_miss: Joi.string().required(),
						packaging: Joi.string().required(),
						mrp: Joi.number().min(0).required(),
						discount: Joi.number().min(0).required(),
						gst: Joi.number().min(0).required(),
						prescription_required: Joi.boolean().required(),
						label: Joi.string().required(),
						fact_box: Joi.string().required(),
						primary_use: Joi.string().required(),
						salt_synonyms: Joi.string().required(),
						storage: Joi.string().required(),
						use_of: Joi.string().required(),
						common_side_effect: Joi.string().required(),
						alcohol_interaction: Joi.string().required(),
						pregnancy_interaction: Joi.string().required(),
						lactatin_interaction: Joi.string().required(),
						driving_interaction: Joi.string().required(),
						kidney_interaction: Joi.string().required(),
						liver_interaction: Joi.string().required(),
						otherDrugs_interaction: Joi.string().required(),
						country_of_origin: Joi.string().required(),
					})
				)
				.required(),
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
            console.log("error"+error)
			return helper.validationMessageKey("validation", error);
		}
		return null;
	}
};
