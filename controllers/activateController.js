const Jimp = require('jimp');
const path = require("path");
const userService = require('../services/userService');
const userDto = require('../dtos/userDto');

class ActivateController {
    async activate(req, res) {
        try {
            const { name, avater } = req.body;
            const userId = req.user.id;

            if (!name || !avater) {
                return res.status(400).json({ message: 'All fields are required!' });
            }

            // Remove base64 prefix and create the buffer
            const buffer = Buffer.from(avater.replace(/^data:image\/(png|jpg);base64,/, ''), 'base64');

            // Generate a random image name
            const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

            // Resolve the full path where the image will be saved
            const fullPath = path.resolve(__dirname, '../storage', imagePath);

            // // Process the image
            const image = await Jimp.read(buffer);
            image.resize(150, Jimp.AUTO).write(fullPath);

            // Prepare the update data
            const updateData = {
                name: name,
                avater: `/storage/${imagePath}`,  // Store relative URL
                isActivated: true
            };

            // // Update the user in the database
            /// we cal also used .save();
            const updateUser = await userService.updateUser(userId, updateData);
            console.log(updateUser);


            res.json({ user: new userDto(updateUser), auth: true });

        } catch (error) {
            console.error(error);  // Log the error for debugging
            res.status(500).json({ message: "Failed to save user in db" });
        }
    }
}

module.exports = new ActivateController();
