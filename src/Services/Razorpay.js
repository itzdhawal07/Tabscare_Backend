const axios = require('axios');

const apiKey = 'cnpwX3Rlc3RfSlMzT0M5Q1J6YkNrUEE6MldBTmdvZlV4ZlVDc2c1cG51TkJlelhY';

async function createRazorpayOrder(data) {
    try {
        const config = {
            method: 'post',
            url: 'https://api.razorpay.com/v1/orders',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${apiKey}`,
            },
            data: data,
        };

        const response = await axios(config);
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports = { createRazorpayOrder };