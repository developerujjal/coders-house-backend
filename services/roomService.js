const RoomDto = require('../dtos/roomDto');
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

        return res.json(new RoomDto(room));;
    }

    
}

module.exports = new RoomService();
