const roomService = require("../services/roomService");
const User = require("../models/newUserModal");
const RoomDto = require("../dtos/roomDto");

class RoomController {
  async createRoom(req, res) {
    try {
      const { roomTopic, roomType } = req.body;

      if (!roomTopic || !roomType) {
        return res.status(400).json({ message: "All Field Required!" });
      }

      //Find the user
      const user = await User.findOne({ email: req.user?.email });

      const room = await roomService.create({
        roomTopic,
        roomType,
        ownerId: user?._id,
      });

      return res.json(new RoomDto(room));
    } catch (error) {
      res.status(500).json({ message: "Faild to create a room" });
    }
  };

  async index(req, res) {
    const rooms = await roomService.getAllRooms(["open"]);
    const allRooms = rooms.map((room) => new RoomDto(room));

    return res.json(allRooms); // return optional
  };

  async getSingelRoom(req, res) {
    try {

      const roomId = req.params?.roomId;
      const room = await roomService.getRoom(roomId);
      return res.json(room);

    } catch (error) {
      res.status(500).json({ message: "Faild to fetch room" })
    }
  };


}

module.exports = new RoomController();
