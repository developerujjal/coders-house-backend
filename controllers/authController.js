const optService = require('../services/otpService')


class AuthController {
    async sendOtp(req, res) {

        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Phone Number is required!" }) // send allow
        }

        const otp = optService.generateOTP();


        res.send({ otp })
    }
}


module.exports = new AuthController();

