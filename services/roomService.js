const Rooms = require('../models/roomModal');


class RoomService {
    async create(payLoad) {
        const { roomTopic, roomType, ownerId } = payLoad;

        const room = await Rooms.create({
            roomTopic,
            roomType,
            ownerId,
            speakers: [ownerId]

        })

        return room;
    }


    async getAllRooms(types) {
        const rooms = await Rooms.find({ roomType: { $in: types } });
        return rooms;
    }


}

module.exports = new RoomService();
