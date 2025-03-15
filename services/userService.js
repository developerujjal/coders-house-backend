const User = require('../models/userModel');

class UserService {
    async findUser(phone) {

        const user = await User.findOne({ phone })
        return user;
    }

    async createUser(data) {
        const user = await User.create(data);
        return user;
    }
}


module.exports = new UserService();