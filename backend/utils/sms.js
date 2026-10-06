/**
 * DLT-compliant SMS sender (India). All provider details come from backend/.env:
 *   SMS_API_KEY, SMS_SENDER_ID, SMS_DLT_PE_ID, SMS_DLT_TEMPLATE_ID, SMS_OTP_TEMPLATE, SMS_API_URL
 *
 * SMS_API_URL is a GET URL with placeholders {apikey} {phone} {sender} {message} {peid} {templateid}
 * (all values are URL-encoded here), so a different gateway only needs a different URL.
 */

const DEFAULT_URL =
    'http://cloud.smsindiahub.in/vendorsms/pushsms.aspx?APIKey={apikey}&msisdn={phone}&sid={sender}&msg={message}&fl=0&gwid=2&peid={peid}&templateid={templateid}';

const isConfigured = () => Boolean(process.env.SMS_API_KEY && process.env.SMS_SENDER_ID && process.env.SMS_DLT_TEMPLATE_ID);

// The text must match the DLT-registered template exactly, or operators drop the message.
const DEFAULT_OTP_TEMPLATE = 'Welcome to the HgEnterprises powered by Appzeto.Your OTP for registration is ##var##.BGADEC';

const buildOtpMessage = (otp) => {
    // In a .env file "#" starts a comment, which silently chops "##var##.BGADEC" off the template.
    // Only trust the env value if it still contains the placeholder; otherwise use the registered text.
    const fromEnv = process.env.SMS_OTP_TEMPLATE;
    const template = fromEnv && fromEnv.includes('##var##') ? fromEnv : DEFAULT_OTP_TEMPLATE;
    return template.replace('##var##', otp);
};

// SMSIndiaHub replies {"ErrorCode":"000","ErrorMessage":"Done",...} on success. Anything else is a failure.
const isGatewaySuccess = (body) => {
    try {
        const json = JSON.parse(body);
        if (json && typeof json === 'object' && 'ErrorCode' in json) return String(json.ErrorCode) === '000';
    } catch (_) { /* not JSON, fall through */ }
    return !/\b(fail|failed|invalid|insufficient|denied|rejected)\b/i.test(body);
};

async function sendSms(phone10, message) {
    const values = {
        apikey: process.env.SMS_API_KEY,
        phone: `91${phone10}`,
        sender: process.env.SMS_SENDER_ID,
        message,
        peid: process.env.SMS_DLT_PE_ID || '',
        templateid: process.env.SMS_DLT_TEMPLATE_ID,
    };
    const url = (process.env.SMS_API_URL || DEFAULT_URL).replace(/\{(\w+)\}/g, (_, k) => encodeURIComponent(values[k] ?? ''));

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const body = (await res.text()).slice(0, 600);
    // Gateways often answer HTTP 200 even when they refuse the message, so the body decides
    if (!res.ok || !isGatewaySuccess(body)) {
        throw new Error(`SMS gateway rejected the request: ${body}`);
    }
    return body;
}

const sendOtpSms = (phone10, otp) => sendSms(phone10, buildOtpMessage(otp));

module.exports = { isConfigured, sendOtpSms };
