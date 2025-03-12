const crypto = require("crypto");

class HashService {
    async hashOtp(data) {
        return crypto.createHmac('sha256', `${process.env.HASH_DATA_SECRET_KEY}`).update("Barry").digest('hex');

    }
}


module.exports = new HashService();