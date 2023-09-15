const Joi = require("joi");
const helper = require("../helpers/helper");

module.exports = {
    async loginUsingMobileValidation(req){
        const schema = Joi.object({
            mobile: Joi.string().length(10).required(),
            userType: Joi.string().valid('ADMIN', 'VENDOR', 'DOCTOR', 'PHARMACIST', 'DELIVERYBOY','CUSTOMER').required()
		}).unknown(true);
		const { error } = schema.validate(req);
		if (error) {
			return helper.validationMessageKey("validation", error);
		}
		return null;
    },
    async loginUsingEmailValidation(req){
        const schema = Joi.object({
            email: Joi.string().required(),
            userType: Joi.string().valid('ADMIN', 'VENDOR', 'DOCTOR', 'PHARMACIST', 'DELIVERYBOY','CUSTOMER').required()
        }).unknown(true);
        const { error } = schema.validate(req);
        if(error){
            return helper.validationMessageKey("validation", error);
        }
        return null;
    },
    async loginUsingWecareEmailValidation(req){
        const schema = Joi.object({
            email: Joi.string().required(),
        }).unknown(true);
        const { error } = schema.validate(req);
        if(error){
            return helper.validationMessageKey("validation", error);
        }
        return null;
    },
    async createWeCareUserValidation(req){
        const schema = Joi.object({
            email: Joi.string().email().required(),
            userType: Joi.string().valid('ADMIN', 'VENDOR', 'DOCTOR', 'PHARMACIST').required()
        }).unknown(true);
        const { error } = schema.validate(req);
        if(error){
            return helper.validationMessageKey("validation", error);
        }
        return null;
    },
    async verifyMobileOtpValidation(req){
        const schema = Joi.object({
            mobile: Joi.string().length(10).required(),
            otp: Joi.string().length(6).required()
        }).unknown(true);
        const { error } = schema.validate(req);
        if(error){
            return helper.validationMessageKey("validation", error);
        }
        return null;
    },
    async verifyEmailOtpValidation(req){
        const schema = Joi.object({
            email: Joi.string().required(),
            otp: Joi.string().length(6).required()
        }).unknown(true);
        const { error } = schema.validate(req);
        if(error){
            return helper.validationMessageKey("validation", error);
        }
        return null;
    }   
}