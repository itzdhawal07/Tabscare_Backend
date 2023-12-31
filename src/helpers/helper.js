const { ACTIVE_STATUS, PAGINATION_LIMIT, APP_URL } = require("../../config/key");

module.exports = {
    toUpperCase: (str) => {
		if (str.length > 0) {
			const newStr = str
				.toLowerCase()
				.replace(/_([a-z])/, (m) => m.toUpperCase())
				.replace(/_/, "");
			return str.charAt(0).toUpperCase() + newStr.slice(1);
		}
		return "";
	},
    
	validationMessageKey: (apiTag, error) => {
		let key = module.exports.toUpperCase(error.details[0].context.key);
		let type = error.details[0].type.split(".");
		type = module.exports.toUpperCase(type[1]);
		key = apiTag + key + type + " : " + error.details[0].message;
		return key;
	},

	getPageAndLimit: (page, limit) => {
		if (!page) page = 1;
		if (!limit) limit = PAGINATION_LIMIT;
		let limitCount = limit * 1;
		let skipCount = (page - 1) * limitCount;
		return { limitCount, skipCount };
	},
};