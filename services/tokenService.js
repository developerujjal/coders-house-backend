const jwt = require('jsonwebtoken');

const accessSecretToken = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretToken = process.env.REFRESH_TOKEN_SECRET;

class TokenService {
    async getTokens(payLoad) {
        const accessToken = jwt.sign(payLoad, accessSecretToken, {
            expiresIn: "1h"
        });

        const refreshToken = jwt.sign(payLoad, refreshSecretToken, {
            expiresIn: '1y'
        })

        return { accessToken, refreshToken };
    }
}


module.exports = new TokenService();