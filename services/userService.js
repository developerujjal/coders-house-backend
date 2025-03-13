const getUserCollection = require('../models/userCollection');

class UserService {
    async findUser(phone) {
        const userCollection = await getUserCollection(); // Direct call, no need for `.userCollection()`
        const result = await userCollection.findOne({ phone });
        return result;
    }

    async createUser(data) {
        const userCollection = await getUserCollection(); // Direct call, no need for `.userCollection()`
        const result = await userCollection.insertOne(data);
        return result;
    }
}


module.exports = new UserService();