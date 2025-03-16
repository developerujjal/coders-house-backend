class UserDto {
    _id;
    name;
    avater;
    phone;
    isActivated;

    constructor(user) {
        this._id = user?._id,
            this.name = user?.name,
            this.avater = user?.avater ? `${process.env.BASE_URL}${user?.avater}` : null,
            this.phone = user?.phone,
            this.isActivated = user?.isActivated
    }
}

module.exports = UserDto;