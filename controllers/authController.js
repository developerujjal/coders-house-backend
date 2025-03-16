const otpService = require('../services/otpService');
const hashService = require('../services/hashService');
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const UserDto = require('../dtos/userDto');


class AuthController {
    async sendOtp(req, res) {
        try {

            const { phone } = req.body;

            if (!phone) {
                return res.status(400).json({ message: "Phone Number is required!" }); // send allow
            }

            //Generate OTP
            const otp = await otpService.generateOTP();
            console.log(otp);

            const totalTime = 1000 * 60 * 2; // 2 min
            const expireTime = Date.now() + totalTime;
            const data = `${phone}.${otp}.${expireTime}`;

            //Make hash the data;
            const hash = hashService.hashOtp(data);


            //send code by sms
            // await otpService.sendBySMS(phone, otp)


            res.send({
                data: `${hash}.${expireTime}`,
                phone,
                otp

            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Faild to send code using SMS' });
        }
    }



    async verifyOtp(req, res) {
        try {
            const { hash, otp, phone } = req.body;

            if (!hash || !otp || !phone) {
                return res.status(400).json({ message: "All fields are required!" });
            }

            const hashResult = hash.split('.');
            const [hashData, expireTime] = hashResult;

            if (Date.now() > parseFloat(expireTime)) {
                return res.status(400).json({ message: "OTP Expired!" });
            }


            const data = `${phone}.${otp}.${expireTime}`;

            const isValid = otpService.verifyOtp(hashData, data);
            if (!isValid) {
                return res.status(400).json({ message: "Invalid OTP" })
            };

            let user;

            user = await userService.findUser(phone);

            if (!user) {
                const data = {
                    phone: phone,
                    isActivated: false,
                    createdAt: Date.now()
                }

                user = await userService.createUser(data);
            }

            console.log(user)

            const { accessToken, refreshToken } = tokenService.getTokens({ id: user?._id, isActivated: false });

            const tokenData = {
                token: refreshToken,
                userId: user?._id
            }

            await tokenService.storedRefreshToken(tokenData);


            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 30
            });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 30
            });


            // User projection
            const userInfo = new UserDto(user);

            res.json({ user: userInfo, auth: true });



        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Faild to verify otp" });
        }
    }
}


module.exports = new AuthController();

