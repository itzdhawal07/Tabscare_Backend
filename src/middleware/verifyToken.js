const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
const responseHelper = require("../helpers/responseHelper");
const { ACTIVE, DELETED_STATUS, JWT_AUTH_TOKEN_SECRET, SERVER_ERR, UNAUTHORIZED } = require("../../config/key");

exports.verifyAuthToken = async (req, res, next) => {
	try {
	  	// Check if the authorization token exists
		if (!req.header("Authorization")) {
			return responseHelper.error(res, res.__("TokenNotFound"), UNAUTHORIZED);
		}
  
		const token = req.header("Authorization").replace("Bearer ", "");

		// Verify the token
		const decoded = jwt.verify(token, JWT_AUTH_TOKEN_SECRET);

		// Find the user by primary key (id) and check isActive status
		const user = await User.findOne({
			where: {
				id: decoded.id,
				isActive: ACTIVE,
			},
		});

		if(!user) {
			return responseHelper.error(res, res.__("UnauthorizedContent"), UNAUTHORIZED);
		}

		req.user = user;
		req.token = token;
		next();
	} catch (error) {
		console.log(error,'error');
		return responseHelper.error(res, res.__("InvalidToken"), UNAUTHORIZED);
	}
};

exports.verifyAdminToken = (req, res, next) => {

	//check authorization token exist or not
	if (!req.header("Authorization"))
		return responseHelper.error(res, res.__("TokenNotFound"), UNAUTHORIZED);

	const token = req.header("Authorization").replace("Bearer ", "");

	jwt.verify(token, JWT_AUTH_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return responseHelper.error(res, res.__("InvalidToken"), UNAUTHORIZED);
		}
		if (!decoded) return responseHelper.error(res, res.__("TokenExpired"), UNAUTHORIZED);
		
		UserModel.findOne({ _id: decoded.tokenObject._id, status: { $ne: DELETED_STATUS }, role : 4}, (err, user) => {
			if(err) {
				return responseHelper.error(res, res.__("UnauthorizedContent"), err);
			}
			if(user === null || user === undefined)
				return responseHelper.error(res, res.__("UserNotFound"), UNAUTHORIZED);

			if(user.status === ACTIVE_STATUS) {
				req.user = user;
				req.token = token;
				next();
			} else {
				return responseHelper.error(res, res.__("UnauthorizedContent"), UNAUTHORIZED);
			}
		});
	});
};

exports.verifyResetToken = (req, res, next) => {
	const resetToken = req.params.token;
	if (!resetToken) {
		return responseHelper.error(res, res.__("InvalidToken"), UNAUTHORIZED);
	} else {
		jwt.verify(resetToken, JWT_AUTH_TOKEN_SECRET, async (err, decoded) => {
			if (decoded) {
				const foundUser = await UserModel.findOne({
					_id: decoded._id,
					resetToken: resetToken,
				});
				if (foundUser === null || foundUser === undefined) {
					return responseHelper.error(res, res.__("TokenExpired"), UNAUTHORIZED);
				} else {
					if (foundUser.status === ACTIVE_STATUS) {
						req.user = foundUser;
						req.token = resetToken;
						next();
					} else {
						return responseHelper.error(res, res.__("UnauthorizedContent"), UNAUTHORIZED);
					}
				}
			} else {
				return responseHelper.error(res, res.__("TokenExpired"), UNAUTHORIZED);
			}
		});
	}
};
