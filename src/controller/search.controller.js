const responseHelper = require("../helpers/responseHelper");
const {
	SERVERERROR,
	FAILURE,
} = require("../../config/key");

exports.searchProduct = async (req, res) => {
    try{
        let reqParam = req.body;

        return responseHelper.error(res, res.__("ErrorUpdatingReview"), FAILURE);
    }catch(error){
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}