const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // phone: { type: String, required: true, unique: true },

    phone: { type: String, required: true },
    name: { type: String, required: false },
    avater: { type: String, required: false },
    isActivated: { type: Boolean, required: false, default: false }
}, {
    timestamps: true
})

const Users = mongoose.model('Users', userSchema, 'users');

module.exports = Users;