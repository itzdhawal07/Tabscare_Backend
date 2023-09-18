const responseHelper = require("../helpers/responseHelper");
const authValidation = require("../validations/auth.validation");
const {
    SERVERERROR,
    JWT_EXPIRES_IN,
    SUCCESS,
    FAILURE,
    JWT_AUTH_TOKEN_SECRET
} = require("../../config/key");
const { User, OTP } = require('../models/index');
const { sendSMS, sendWhatsAppMessage } = require("../Services/Message");
const { sendMailToCustomer } = require("../Services/Mailer");
const dayjs = require("dayjs");
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

exports.loginUsingMobile = async (req, res) => {
    try {
        const reqParam = req.body;

        // Validate login using mobile Request.
        let validationMessage = await authValidation.loginUsingMobileValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const mobile = reqParam.mobile;

        // Sync the User and OTP tables to ensure they exist
        await User.sync({ force: false });
        await OTP.sync({ force: false });

        // Check if the user with the given phone number exists
        const existingUser = await User.findOne({
            where: {
                mobile: mobile,
            },
        });
    
        if (!existingUser) {
            // User not found, create a new user
            const newUser = await User.create({
                mobile: mobile,
                userType: req.body.userType || 'CUSTOMER', // Set a default value if not provided
            });

            // Generate and save OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpStartTime = dayjs();;
            const otpEndTime = otpStartTime.add(10, 'minutes');

            // // Send OTP via SMS
            // const smsResult = await sendSMS(newUser.mobile, otp);

            // Send OTP via WhatsApp
            const whatsappResult = await sendWhatsAppMessage(newUser.mobile, otp);

            if (whatsappResult.error) {
                // Handle error from SMS or WhatsApp
                return responseHelper.error(res, res.__("ErrorSendingOTP"), FAILURE);
            }

            const newOTP = await OTP.create({
                userId: newUser.id,
                otp: otp,
                otpStartTime: otpStartTime.format('YYYY-MM-DD HH:mm:ss'),
                otpEndTime: otpEndTime.format('YYYY-MM-DD HH:mm:ss'),
                status: 'OPEN',
            });
            await newOTP.save();

            return responseHelper.successapi(res, res.__("UserCreatedAndOTPSentSuccessfully"), SUCCESS, newUser);
        } else {
            // User found, generate and save OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpStartTime = dayjs();;
            const otpEndTime = otpStartTime.add(10, 'minutes');

            // Send OTP via SMS
            // const smsResult = await sendSMS(existingUser.mobile, otp);

            // Send OTP via WhatsApp
            const whatsappResult = await sendWhatsAppMessage(existingUser.mobile, otp);

            if(whatsappResult.error) {
                // Handle error from SMS or WhatsApp
                return responseHelper.error(res, res.__("ErrorSendingOTP"), FAILURE);
            };

            const newOTP = await OTP.create({
                userId: existingUser.id,
                otp: otp,
                otpStartTime: otpStartTime.format('YYYY-MM-DD HH:mm:ss'),
                otpEndTime: otpEndTime.format('YYYY-MM-DD HH:mm:ss'),
                status: 'OPEN',
            });
            await newOTP.save();
            
            return responseHelper.successapi(res, res.__("OTPSentSuccessfully"), SUCCESS, existingUser);
        }
    }catch(e){
        console.log(e,"error")
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.loginUsingEmail = async (req, res) => {
    try {
        const reqParam = req.body;

        // Validate login using email Request.
        let validationMessage = await authValidation.loginUsingEmailValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const email = reqParam.email;

        // Sync the User and OTP tables to ensure they exist
        await User.sync({ force: false });
        await OTP.sync({ force: false });

        // Check if the user with the given email exists
        const existingUser = await User.findOne({
            where: {
                email: email,
            },
        });

        if(!existingUser) {
            // User not found, create a new user
            const newUser = await User.create({
                email: email,
                userType: req.body.userType || 'CUSTOMER', // Set a default value if not provided
            });

            // Generate and save OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpStartTime = dayjs();;
            const otpEndTime = otpStartTime.add(10, 'minutes');

            // Send OTP via email
            try {
                const emailContent = "<b>" + otp + "</b> is your One-Time-Password (OTP) you to login at your TABS.CARE account. It is valid for 10 mins.";

                await sendMailToCustomer(email, emailContent, 'Infytabs Technologies Pvt Ltd account email verification code');
            } catch (emailError) {
                console.log(emailError);
                return responseHelper.error(res, res.__("ErrorSendingEmail"), FAILURE);
            };

            const newOTP = await OTP.create({
                userId: newUser.id,
                otp: otp,
                otpStartTime: otpStartTime.format('YYYY-MM-DD HH:mm:ss'),
                otpEndTime: otpEndTime.format('YYYY-MM-DD HH:mm:ss'),
                status: 'OPEN',
            });
            await newOTP.save();

            return responseHelper.successapi(res, res.__("UserCreatedAndEmailSentSuccessfully"), SUCCESS, newUser);
        } else {
            // User found, generate and save OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpStartTime = dayjs();;
            const otpEndTime = otpStartTime.add(10, 'minutes');

            // Send OTP via email
            try {
                const emailContent = `${otp} is your One-Time-Password (OTP) you to login at your TABS.CARE account. It is valid for 10 mins.`;

                await sendMailToCustomer(email, emailContent, 'Infytabs Technologies Pvt Ltd account email verification code');
            } catch (emailError) {
                console.log(emailError);
                return responseHelper.error(res, res.__("ErrorSendingEmail"), FAILURE);
            }

            const newOTP = await OTP.create({
                userId: newUser.id,
                otp: otp,
                otpStartTime: otpStartTime.format('YYYY-MM-DD HH:mm:ss'),
                otpEndTime: otpEndTime.format('YYYY-MM-DD HH:mm:ss'),
                status: 'OPEN',
            });
            await newOTP.save();

            return responseHelper.successapi(res, res.__("EmailSentSuccessfully"), SUCCESS, existingUser);
        }
    }catch(e){
        console.log(e,"error")
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.loginUsingWecareEmail = async (req, res) => {
    try {
        const reqParam = req.body;
        
        // Validate login using email Request.
        let validationMessage = await authValidation.loginUsingWecareEmailValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const email = reqParam.email;

        // Sync the User and OTP tables to ensure they exist
        await User.sync({ force: false });
        await OTP.sync({ force: false });

        // Check if the user with the given email exists
        const existingUser = await User.findOne({
            where: {
                email: email,
                userType: {
                    [Op.in]: ['ADMIN', 'VENDOR', 'DOCTOR', 'PHARMACIST']
                }
            },
        });

        if (!existingUser) {
            // User not found, return error message
            return responseHelper.error(res, res.__("UserNotFoundWithGivenEmail"), SERVERERROR);
        } else {
            // User found, generate and save OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpStartTime = dayjs();;
            const otpEndTime = otpStartTime.add(10, 'minutes');

            // Send OTP via email
            try {
                const emailContent = "<b>" + otp + "</b> is your One-Time-Password (OTP) you to login at your TABS.CARE account. It is valid for 10 mins.";

                await sendMailToCustomer(email, emailContent, 'Infytabs Technologies Pvt Ltd account email verification code');
            } catch (emailError) {
                console.log(emailError);
                return responseHelper.error(res, res.__("ErrorSendingEmail"), FAILURE);
            }

            const newOTP = await OTP.create({
                userId: existingUser.id,
                otp: otp,
                otpStartTime: otpStartTime.format('YYYY-MM-DD HH:mm:ss'),
                otpEndTime: otpEndTime.format('YYYY-MM-DD HH:mm:ss'),
                status: 'OPEN',
            });
            await newOTP.save();

            return responseHelper.successapi(res, res.__("EmailSentSuccessfully"), SUCCESS, existingUser);
        }
    }catch(e){
        console.log(e,"error")
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.createWecareUser = async (req, res) => {
    try {
        const reqParam = req.body;

        // Validate createWeCareUser Request.
        let validationMessage = await authValidation.createWeCareUserValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const email = reqParam.email;

        // Sync the User and OTP tables to ensure they exist
        await User.sync({ force: false });
        await OTP.sync({ force: false });

        // Check if the user with the given email exists
        const existingUser = await User.findOne({
            where: {
                email: email,
            },
        });

        if(!existingUser) {
            // Check if the provided userType is valid
            if (['ADMIN', 'VENDOR', 'DOCTOR', 'PHARMACIST'].includes(req.body.userType)) {
                const newUser = await User.create({
                    email: email,
                    userType: req.body.userType,
                });

                // Generate and save OTP
                const otp = Math.floor(100000 + Math.random() * 900000);
                const otpStartTime = dayjs();;
                const otpEndTime = otpStartTime.add(10, 'minutes');

                // Send OTP via email
                try {
                    const emailContent = "<b>" + otp + "</b> is your One-Time-Password (OTP) you to login at your TABS.CARE account. It is valid for 10 mins.";

                    await sendMailToCustomer(email, emailContent, 'Infytabs Technologies Pvt Ltd account email verification code');
                } catch (emailError) {
                    console.log(emailError);
                    return responseHelper.error(res, res.__("ErrorSendingEmail"), FAILURE);
                };

                const newOTP = await OTP.create({
                    userId: newUser.id,
                    otp: otp,
                    otpStartTime: otpStartTime.format('YYYY-MM-DD HH:mm:ss'),
                    otpEndTime: otpEndTime.format('YYYY-MM-DD HH:mm:ss'),
                    status: 'OPEN', //status - OPEN, VERIFIED, EXPIRED
                });
                await newOTP.save();

                return responseHelper.successapi(res, res.__("WecareUserCreatedAndEmailSentSuccessfully"), SUCCESS, newUser);
            } else {
                // Invalid userType
                return responseHelper.error(res, res.__("InvalidUserType"), FAILURE);
            }
        } else {
            // User with the given email already exists
            return responseHelper.error(res, res.__("EmailAlreadyExists"), FAILURE);
        }
    } catch (e) {
        console.log(e, "error");
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const reqParam = req.body;
        const mobile = reqParam.mobile;
        const otp = reqParam.otp;

        // Validate verify mobile otp Request.
        let validationMessage = await authValidation.verifyMobileOtpValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Check if the user with the given phone number exists
        const user = await User.findOne({
            where: {
                mobile: mobile,
            },
        });

        if (!user) return responseHelper.error(res, "User not found with the given phone number", FAILURE);

        // Check if there are any OTP records for the user
        const otpRecords = await OTP.findAll({
            where: {
                userId: user.id,
            },
            raw: true
        });

        console.log(otpRecords,'otpRecords');

        let otpFound = false;

        for (const otpRecord of otpRecords) {
            console.log(otpRecord,'singleOtp');
            if (otp === otpRecord.otp) {
                // OTP matches one of the records

                // Check if the OTP is expired
                const currentTime = dayjs();
                const otpEndTime = dayjs(otpRecord.otpEndTime, 'YYYY-MM-DD HH:mm:ss');
                if (currentTime.isBefore(otpEndTime) && otpRecord.status === 'OPEN') {
                    // OTP is verified and not expired

                    // Update the OTP status to VERIFIED
                    await OTP.update(
                        { status: 'VERIFIED' },
                        {
                            where: {
                                id: otpRecord.id,
                            },
                        }
                    );

                    otpFound = true;

                    // Generate an access token
                    const accessToken = jwt.sign({
                        id: user.id, phone: user.phone, userType: user.userType,
                    },
                        JWT_AUTH_TOKEN_SECRET,
                        { expiresIn: JWT_EXPIRES_IN } // Set the expiration time as needed
                    );

                    return responseHelper.successapi(res, "OTP verified", SUCCESS, { user, accessToken });
                } else {
                    // OTP is expired
                    await OTP.update(
                        { status: 'EXPIRED' },
                        {
                            where: {
                                id: otpRecord.id,
                            },
                        }
                    );
                }
            }
        }

        // OTP mismatched
        if (!otpFound) return responseHelper.error(res, "Wrong OTP!", FAILURE);
    } catch (error) {
        console.log(error);
        return responseHelper.error(res, "Something went wrong! Please try again later", SERVERERROR);
    }
}

exports.verifyEmailOTP = async (req, res) => {
    try {
        const reqParam = req.body;
        const email = reqParam.email;
        const otp = reqParam.otp;

        // Validate verify email otp Request.
        let validationMessage = await authValidation.verifyEmailOtpValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Check if the user with the given phone number exists
        const user = await User.findOne({
            where: {
                email: email,
            },
        });

        if (!user) return responseHelper.error(res, "User not found with the given email", FAILURE);

        // Check if there are any OTP records for the user
        const otpRecords = await OTP.findAll({
            where: {
                userId: user.id,
            },
        });

        let otpFound = false;

        for (const otpRecord of otpRecords) {
            if (otp === otpRecord.otp) {
                // OTP matches one of the records

                // Check if the OTP is expired
                const currentTime = dayjs();
                const otpEndTime = dayjs(otpRecord.otpEndTime, 'YYYY-MM-DD HH:mm:ss');
                if (currentTime.isBefore(otpEndTime) && otpRecord.status === 'OPEN') {
                    // OTP is verified and not expired

                    // Update the OTP status to VERIFIED
                    otpRecord.status = 'VERIFIED';
                    await otpRecord.save();

                    otpFound = true;

                    // Generate an access token
                    const accessToken = jwt.sign({
                        id: user.id, phone: user.phone, userType: user.userType,
                    },
                        JWT_AUTH_TOKEN_SECRET,
                        { expiresIn: JWT_EXPIRES_IN } // Set the expiration time as needed
                    );

                    return responseHelper.successapi(res, "OTP verified", SUCCESS, { user, accessToken });
                } else {
                    // OTP is expired
                    otpRecord.status = 'EXPIRED';
                    await otpRecord.save();
                }
            }
        }

        // OTP mismatched
        if (!otpFound) return responseHelper.error(res, "Wrong OTP!", FAILURE);
    } catch (error) {
        console.log(error);
        return responseHelper.error(res, "Something went wrong! Please try again later", SERVERERROR);
    }
}