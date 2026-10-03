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
const buildOtpMessage = (otp) =>
    (process.env.SMS_OTP_TEMPLATE || 'Welcome to the HgEnterprises powered by Appzeto.Your OTP for registration is ##var##.BGADEC')
        .replace('##var##', otp);

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
    const body = (await res.text()).slice(0, 300);
    // Gateways often answer 200 with an error in the body; treat explicit failure words as failure
    if (!res.ok || /\b(error|invalid|fail|insufficient|denied)/i.test(body)) {
        throw new Error(`SMS gateway rejected the request: ${body}`);
    }
    return body;
}

const sendOtpSms = (phone10, otp) => sendSms(phone10, buildOtpMessage(otp));

module.exports = { isConfigured, sendOtpSms };
