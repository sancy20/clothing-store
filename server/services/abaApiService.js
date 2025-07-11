const axios = require("axios");
const crypto = require("crypto");

const ABA_API_URL = process.env.ABA_API_URL;
const ABA_MERCHANT_ID = process.env.ABA_MERCHANT_ID;
const ABA_PUBLIC_KEY = process.env.ABA_PUBLIC_KEY;
const ABA_PRIVATE_KEY = process.env.ABA_PRIVATE_KEY.replace(/\\n/g, "\n");
const PAYWAY_RSA_PUBLIC_KEY = process.env.PAYWAY_RSA_PUBLIC_KEY.replace(
  /\\n/g,
  "\n"
);

const generateQrCode = async ({ orderId, amount }) => {
  try {
    const req_time = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const tran_id = orderId.toString();
    const formattedAmount = parseFloat(amount).toFixed(2).toString();

    console.log("---- PayWay Signing Debug ----");
    console.log("ABA_API_URL:", ABA_API_URL);
    console.log("ABA_MERCHANT_ID:", ABA_MERCHANT_ID);
    console.log("ABA_PUBLIC_KEY:", ABA_PUBLIC_KEY);
    console.log("ABA_PRIVATE_KEY loaded:", !!ABA_PRIVATE_KEY);
    console.log(
      "String parts:",
      req_time,
      ABA_MERCHANT_ID,
      tran_id,
      formattedAmount
    );
    console.log("------------------------------");

    if (!ABA_MERCHANT_ID || !ABA_PUBLIC_KEY || !ABA_PRIVATE_KEY) {
      throw new Error("Missing required PayWay environment variables.");
    }

    const payload = {
      merchant_id: ABA_MERCHANT_ID,
      apikey: ABA_PUBLIC_KEY,
      req_time: req_time,
      tran_id: tran_id,
      amount: formattedAmount,
      items: [],
    };

    const stringToSign = `${req_time}${ABA_MERCHANT_ID}${ABA_PUBLIC_KEY}${tran_id}${formattedAmount}`;
    console.log("String being signed:", stringToSign);

    const signer = crypto.createSign("RSA-SHA512");
    signer.update(stringToSign);
    signer.end();

    const signature = signer.sign(ABA_PRIVATE_KEY, "base64");

    const finalRequestBody = { ...payload, hash: signature };

    const response = await axios.post(
      `${ABA_API_URL}/payments/purchase`,
      finalRequestBody
    );

    return { qrCode: response.data.qr_code };
  } catch (error) {
    const specificError =
      error.response?.data?.description ||
      error.response?.data?.message ||
      error.message;
    console.error("PayWay API Error:", specificError);
    throw new Error(`Failed to communicate with PayWay API: ${specificError}`);
  }
};

const verifyWebhook = (payload, receivedSignature) => {
  try {
    const stringToVerify = `${payload.tran_id}${payload.apv}${payload.status}`;

    const verifier = crypto.createVerify("RSA-SHA512");
    verifier.update(stringToVerify);
    verifier.end();

    const isVerified = verifier.verify(
      PAYWAY_RSA_PUBLIC_KEY,
      receivedSignature,
      "base64"
    );
    return isVerified;
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return false;
  }
};

module.exports = {
  generateQrCode,
  verifyWebhook,
};
