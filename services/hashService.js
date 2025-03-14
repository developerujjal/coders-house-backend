const crypto = require("crypto");

class HashService {
    hashOtp(data) {
        const hashCurr = crypto.createHmac('sha256', `${process.env.HASH_DATA_SECRET_KEY}`).update(data).digest('hex');
        return hashCurr;

    }
}


module.exports = new HashService();