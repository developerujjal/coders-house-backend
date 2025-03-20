const roomService = require("../services/roomService");
const User = require("../models/newUserModal");


class RoomController {
    async createRoom(req, res) {
        try {

            const { roomTopic, roomType } = req.body;

            if (!roomTopic || !roomType) {
                return res.status(400).json({ message: "All Field Required!" })
            }


            //Find the user
            const user = await User.findOne({ email: req.user?.email })


            const room = await roomService.create({
                roomTopic,
                roomType,
                ownerId: user?._id.toString(),
                ownerIdTwo: user?._id
            })


        } catch (error) {
            res.status(500).json({ message: "Faild to create a room" })
        }
    }

}

module.exports = new RoomController();