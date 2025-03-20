class RoomDto {
    roomTopic;
    roomType;
    ownerId;
    speakers;
    createdAt;

    constructor(room) {
        this.roomTopic = room.roomTopic,
            this.roomTopic = room.roomType,
            this.ownerId = room.ownerId,
            this.speakers = room.speakers,
            this.createdAt = room.createdAt
    }

}

module.exports = RoomDto;