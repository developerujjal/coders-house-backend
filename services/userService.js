const User = require('../models/userModel');

class UserService {
    async findUser(filter) {

        const user = await User.findOne(filter)
        return user;
    }

    async createUser(data) {
        const user = await User.create(data);
        return user;
    }

    async updateUser(userId, updateData) {

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: updateData },
            { new: true }
        );

        return updatedUser;
    }
}


module.exports = new UserService();