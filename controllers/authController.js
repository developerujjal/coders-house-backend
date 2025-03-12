const otpService = require('../services/otpService');
const hashService = require('../services/hashService');


class AuthController {
    async sendOtp(req, res) {
        try {

            const { phone } = req.body;

            if (!phone) {
                return res.status(400).json({ message: "Phone Number is required!" }) // send allow
            }

            //Generate OTP
            const otp = await otpService.generateOTP();

            const totalTime = 1000 * 60 * 2; // 2 min
            const expireTime = Date.now() + totalTime;
            const data = `${phone}.${otp}.${expireTime}`;

            //Make hash the data;
            const hash = hashService.hashOtp(data);
            console.log(hash)

            //send code by sms
            await otpService.sendBySMS(phone, otp)
           

            res.send({
                data: `${hash}.${expireTime}`,
                phone
            })

        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Faild to send code using SMS' })
        }
    }
}


module.exports = new AuthController();

