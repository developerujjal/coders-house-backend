const crypto = require('crypto');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken, {
    lazyLoading: true
});



class OtpService {

    async generateOTP() {
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }


    async sendBySMS(phone, otp) {
        return await client.messages.create({
            to: phone,
            from: process.env.SMS_FROM_NUMBER,
            messagingServiceSid: process.env.MessagingServiceSid,
            body: `This is your Coder House code: ${otp}`
        })

    }


}

module.exports = new OtpService();