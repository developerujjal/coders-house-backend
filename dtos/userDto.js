class UserDto {
    id;
    name;
    email;
    image;

    constructor(user) {
        this.id = user?._id,
            this.name = user?.name,
            this.email = user?.email,
            this.image = user?.image
    }
}

module.exports = UserDto;