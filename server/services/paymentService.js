const axios = require('axios');

const CARDCOM_CREATE_URL = 'https://secure.cardcom.solutions/api/v11/LowProfile/Create';
const CARDCOM_RESULT_URL = 'https://secure.cardcom.solutions/api/v11/LowProfile/GetLpResult';

async function createPaymentPage(order) {
  const payload = {
    TerminalNumber: Number(process.env.CARDCOM_TERMINAL),
    ApiName: process.env.CARDCOM_API_NAME,
    Amount: order.totalPrice,
    Operation: 'ChargeOnly',
    ReturnValue: String(order._id),
    SuccessRedirectUrl: `${process.env.CLIENT_URL}/order-success`,
    FailedRedirectUrl: `${process.env.CLIENT_URL}/order-failed`,
    WebHookUrl: `${process.env.SERVER_URL}/payments/webhook`,
  };

  const { data } = await axios.post(CARDCOM_CREATE_URL, payload);

  if (data.ResponseCode !== 0) {
    throw new Error(`Cardcom error: ${data.Description}`);
  }

  return {
    url: data.Url,
    lowProfileId: data.LowProfileId,
  };
}

async function verifyPayment(lowProfileId) {
  const payload = {
    TerminalNumber: Number(process.env.CARDCOM_TERMINAL),
    ApiName: process.env.CARDCOM_API_NAME,
    ApiPassword: process.env.CARDCOM_API_PASSWORD,  
    LowProfileId: lowProfileId,
  };

  const { data } = await axios.post(CARDCOM_RESULT_URL, payload);
  return data;   // מחזיר את כל התשובה — הבודק יחליט
}


module.exports = { createPaymentPage , verifyPayment };