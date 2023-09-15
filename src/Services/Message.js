const axios = require('axios');

// Define a function to send SMS
async function sendSMS(phoneNumber, otp) {
    try {
        const apiUrl = "https://api.onex-aura.com/api/sms?key=96K469gL&to=" + phoneNumber + "&from=TABSCR&body=" + otp + "%20is%20your%20One-Time-Password%20(OTP)%20you%20to%20login%20at%20your%20TABS.CARE%20account.%20It%20is%20valid%20for%2010%20mins.&entityid=1001437242476813329&templateid=1007845269791954595";
        
        const config = {
            method: 'get',
            url: apiUrl,
            headers: {}
        };

        const response = await axios(config);
        return response; // You can return the Axios response object
    } catch (error) {
        throw error; // Throw any errors that occur during the request
    }
}

// Define a function to send WhatsApp messages
async function sendWhatsAppMessage(phoneNumber, otp) {
    try {
        const whatsappData = JSON.stringify({
            "phoneNumber": "+91" + phoneNumber,
            "payload": {
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            {
                                "type": "text",
                                "text": otp.toString()
                            }
                        ]
                    }
                ],
                "namespace": "179de0ee_8b1b_4377_963b_90ecb1613088",
                "name": "otp",
                "language": {
                    "code": "en",
                    "policy": "deterministic"
                }
            },
            "to": "91" + phoneNumber,
            "type": "template"
        });

        const whatsappConfig = {
            method: 'post',
            url: 'https://api.wab.ai/whatsapp-api/v1.0/customer/73732/bot/09b1c86c15f243e6/template',
            headers: {
                'Authorization': 'Basic af974f49-1df4-4724-9ff8-49a303a484fd-GFKkpoH',
                'Content-Type': 'application/json'
            },
            data: whatsappData
        };

        const response = await axios(whatsappConfig);
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    sendWhatsAppMessage, // Export the sendWhatsAppMessage function
    sendSMS
};