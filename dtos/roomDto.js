class RoomDto {
    _id;
    roomTopic;
    roomType;
    ownerId;
    speakers;
    createdAt;

    constructor(room) {
        this._id = room._id,
            this.roomTopic = room.roomTopic,
            this.roomTopic = room.roomType,
            this.ownerId = room.ownerId,
            this.speakers = room.speakers,
            this.createdAt = room.createdAt
    }

}

module.exports = RoomDto;