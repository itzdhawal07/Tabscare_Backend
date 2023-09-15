const { default: axios } = require("axios");
const dayjs = require("dayjs");

const generateShiprocketToken = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://apiv2.shiprocket.in/v1/external/auth/login',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*"
                },
                data: {
                    email: "bdm@tabs.care",
                    password: "Tabs@1234"
                }
            };

            const response = await axios(config);
            console.log(response.data, 'ShiprocketGenerateTokenAPIResponse');
            
            const shiprocketToken = response.data?.token;

            if (shiprocketToken) {
                resolve(shiprocketToken);
            } else {
                reject("Shiprocket token not found in the response");
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

const createShiprocketCustomOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token = await generateShiprocketToken();
            console.log(data,'data');

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*"
                },
                data: {
                    order_id: data?.uuid,
                    order_date: dayjs(data?.createdAt).format('YYYY-MM-DD HH:mm'),
                    pickup_location: 'warehouse',
                    billing_customer_name: data?.Address?.customerName,
                    billing_last_name: data?.Address?.customerName,
                    billing_address: `${data?.Address?.line1} ${data?.Address?.line2 ? data?.Address?.line2 : ''}`,
                    billing_city: data?.Address?.city,
                    billing_pincode: data?.Address?.postalCode,
                    billing_state: data?.Address?.state,
                    billing_country: data?.Address?.country,
                    billing_email: data?.Address?.customerEmail,
                    billing_phone: parseInt(data?.Address?.customerMobile),
                    shipping_is_billing: true,
                    order_items: data?.orderProducts?.map((singleProduct) => (
                        {
                            name: singleProduct?.Product?.name,
                            sku: singleProduct?.Product?.sku_code,
                            units: singleProduct?.quantity,
                            selling_price: singleProduct?.price,
                        }
                    )),
                    payment_method: "Prepaid",
                    sub_total: data?.amount,
                    length: 10,
                    breadth: 10,
                    height: 10,
                    weight: 2.5,
                }
            };

            const response = await axios(config);
            console.log(response.data, 'ShiprocketCreateOrderAPIRes');

            resolve(response.data); 
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

const trackShiprocketOrderStatus = (shipmentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token = await generateShiprocketToken();
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${shipmentId}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*"
                }
            };

            const response = await axios(config);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateShiprocketToken, createShiprocketCustomOrder, trackShiprocketOrderStatus }