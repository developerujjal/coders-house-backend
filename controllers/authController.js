const otpService = require('../services/otpService');
const hashService = require('../services/hashService');
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const UserDto = require('../dtos/userDto');
const jwt = require('jsonwebtoken');
const Users = require('../models/newUserModal')


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

            user = await userService.findUser({ phone });

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


    async refresh(req, res) {
        let userData;
        const { refreshToken: refreshTokenFromCookies } = req.cookies;

        try {

            userData = await tokenService.verifyRefreshToken(refreshTokenFromCookies);

        } catch (error) {
            return res.status(401).json({ message: "Invalid Token ki re!" })
        }




        try {
            const token = await tokenService.findRefreshToken(userData?.id, refreshTokenFromCookies);

            console.log("GETTOKEN: ", token)
            if (!token) {
                return res.status(401).json({ message: "Invalid Token nai!" })
            }

        } catch (error) {
            return res.status(500).json({ message: "Internal Error" })
        }


        const user = await userService.findUser({ _id: userData?.id })

        if (!user) {
            return res.status(404).json({ message: "No User" })
        }

        const { accessToken, refreshToken } = tokenService.getTokens({ _id: userData?.id })


        try {
            await tokenService.updateRefreshToken(userData?.id, refreshToken)
        } catch (error) {
            return res.status(500).json({ message: "Internal Error" })
        }



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


        const userInfo = new UserDto(user);
        res.json({ user: userInfo, auth: true });



    }



    async logOut(req, res) {
        try {
            const { refreshToken } = req.cookies;
            await tokenService.removeRefreshToken(refreshToken);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 0
            });

            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 0
            })

            res.json({ user: null, auth: false })

        } catch (error) {
            res.status(500).json({ message: "Faild to logout" })
        }
    }



    async generateJWT(req, res) {
        try {
            const body = req.body;

            const isUser = await Users.findOne({ email: body?.email });
          
            //Insert User data
            if (!isUser) {
                await Users.create(body)
            }

            //Create JWT and Set in Cookies
            const token = jwt.sign(body, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 30
            });
            res.json({ message: true })
        } catch (error) {
            res.status(500).json({ message: "faild to generate JWT" })
        }
    }

    async removedJWT(req, res) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 0
            });

            res.json({ success: true });

        } catch (error) {
            res.status(500).json({ message: "faild to removed JWT" })
        }
    }



}


module.exports = new AuthController();

