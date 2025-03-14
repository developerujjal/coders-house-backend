class UserDto {
    _id;
    phone;
    isActivated;

    constructor(user) {
        this._id = user?._id,
            this.phone = user?.phone,
            this.isActivated = user?.isActivated
    }
}

module.exports = UserDto;