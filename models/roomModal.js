const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomTopic: { type: String, required: true },
    roomType: { type: String, required: true },
    ownerId: { type: mongoose.Schema.ObjectId, required: true, ref: "Users" },
    speakers: {
        type: [
            {
                type: mongoose.Schema.ObjectId, ref: "Users"
            }
        ],
        required: false
    },

}, {
    timestamps: true
}

)


const Rooms = mongoose.model("Rooms", roomSchema, 'rooms');

module.exports = Rooms;