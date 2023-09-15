var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    // port: 465,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "no-reply@tabs.care", // generated ethereal user
        pass: "ulukrnqciarjdclu", // generated ethereal password
    },
});

const sendMailToCustomer = (email, emailBody, subject) => {
    var mailOptions = {
        to: email,
        from: '"Tabscare" <no-reply@tabs.care>',
        subject: subject,
        html: emailBody
    };

    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions).then((result) => {
            resolve(true);
        }).catch(err => {
            reject(err);
            console.log(err);
        })
    })
}

module.exports = { sendMailToCustomer }