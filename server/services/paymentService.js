const axios = require('axios');

const I4U_BASE_URL = process.env.I4U_BASE_URL;
const CREDIT_CARD_COMPANY_TYPE = Number(process.env.I4U_CC_TYPE) || 15;

async function createPaymentPage(order, customer) {
  const payload = {
    request: {
      Invoice4UUserApiKey: process.env.I4U_API_KEY,
      Sum: order.totalPrice,
      CreditCardCompanyType: CREDIT_CARD_COMPANY_TYPE,
      Currency: 'NIS',
      Type: 1,
      FullName: customer.fullName,
      Phone: customer.phone,
      Email: customer.email,
      Description: `הזמנה ${order._id}`,
      OrderIdClientUsage: String(order._id),
      ReturnUrl: `${process.env.CLIENT_URL}/payment/success`,
      CallBackUrl: `${process.env.SERVER_URL}/payments/webhook`,
      IsDocCreate: true,
      IsQaMode: process.env.I4U_QA_MODE === 'true',
    },
  };

  const { data } = await axios.post(`${I4U_BASE_URL}/ProcessApiRequestV2`, payload);
  console.log('INVOICE4U RAW RESPONSE:', JSON.stringify(data));
  const result = data.d || data.ProcessApiRequestV2Result;


  if (!result || (result.Errors && result.Errors.length > 0)) {
    const msg = result?.Errors?.[0]?.Error || 'Unknown invoice4u error';
    throw new Error(`invoice4u error: ${msg}`);
  }

  return { url: result.ClearingRedirectUrl, paymentId: result.PaymentId };
}

async function verifyClearing({ clearingTraceId, paymentId }) {
  const now = new Date();
  const from = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Format as "YYYY-MM-DDTHH:mm:ss" (no Z, no milliseconds) — matches invoice4u docs
  const fmt = (d) => d.toISOString().slice(0, 19);

  const payload = {
    searchParams: {
      FromDate: fmt(from),
      ToDate: fmt(now),
      IsSuccess: true,
    },
    token: process.env.I4U_API_KEY,
  };

  const { data } = await axios.post(`${I4U_BASE_URL}/GetClearingLogByParams`, payload);
  console.log('CLEARING LOGS RAW:', JSON.stringify(data));  // זמני — ראה את המבנה

  const logs = data.d || data.GetClearingLogByParamsResult || [];

  return logs.some(
    (log) =>
      log.IsSuccess === true &&
      log.IsCredit !== true &&
      (String(log.ClearingTraceId) === String(clearingTraceId) ||
        String(log.PaymentId) === String(paymentId))
  );
}
module.exports = { createPaymentPage, verifyClearing };