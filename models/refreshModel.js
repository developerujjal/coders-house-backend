const mongoose = require('mongoose');

const refreshSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
})


const Token = mongoose.model('Token', refreshSchema);

module.exports = Token;