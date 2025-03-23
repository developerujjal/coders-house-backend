const Rooms = require("../models/roomModal");

class RoomService {
  async create(payLoad) {
    const { roomTopic, roomType, ownerId } = payLoad;

    const room = await Rooms.create({
      roomTopic,
      roomType,
      ownerId,
      speakers: [ownerId],
    });

    return room;
  }

  async getAllRooms(types) {
    try {
      const rooms = await Rooms.find({ roomType: { $in: types } })
        .populate("speakers")
        .populate('ownerId')
        .exec();
      return rooms;

    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new RoomService();
