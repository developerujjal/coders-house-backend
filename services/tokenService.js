const jwt = require('jsonwebtoken');
const Token = require('../models/refreshModel');

const accessSecretToken = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretToken = process.env.REFRESH_TOKEN_SECRET;


class TokenService {
    getTokens(payLoad) {
        const accessToken = jwt.sign(payLoad, accessSecretToken, {
            expiresIn: "1h"
        });

        const refreshToken = jwt.sign(payLoad, refreshSecretToken, {
            expiresIn: '1y'
        })

        return { accessToken, refreshToken };
    }


    async storedRefreshToken(data) {
        try {

            await Token.create(data)


        } catch (error) {
            console.log("Store Refresh Token Error", error)
        }
    }


    async verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, refreshSecretToken)

    }

    async findRefreshToken(userId, refreshToken) {
        return await Token.findOne({ userId, token: refreshToken })
    }


    async updateRefreshToken(userId, refreshToken) {
        return await Token.updateOne({ userId }, { token: refreshToken })
    }

}


module.exports = new TokenService();