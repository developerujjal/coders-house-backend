const mongoose = require('mongoose');

const newUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true }
})

const Users = mongoose.model("Users", newUserSchema, 'users');
module.exports = Users;