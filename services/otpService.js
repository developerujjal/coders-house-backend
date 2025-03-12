const crypto = require('crypto');


class OtpService {
    async generateOTP() {
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }

}

module.exports = new OtpService();