const optService = require('../services/otpService');
const hashService = require('../services/hashService')


class AuthController {
    async sendOtp(req, res) {

        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Phone Number is required!" }) // send allow
        }

        const otp = await optService.generateOTP();

        const hashOtp = hashService.hashOtp(otp);
        console.log(hashOtp)

        res.send({ otp })
    }
}


module.exports = new AuthController();

