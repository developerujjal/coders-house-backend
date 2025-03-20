class RoomController {
    async createRoom(req, res) {
        try {
            const roomData = req.body;
            console.log(roomData)

        } catch (error) {
            res.status(500).json({ message: "Faild to create a room" })
        }
    }

}

module.exports = new RoomController();