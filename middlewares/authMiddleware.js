const jwt = require('jsonwebtoken');
// require('dotenv').config();



const authMiddleware = async (req, res, next) => {
    try {

        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized Access" })
        };



        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({ message: "Unauthorized Access" });
            };

            req.user = decoded;
            next();

        })


    } catch (error) {
        res.status(500).json({ message: "Faild middleware" })
    }
}

module.exports = authMiddleware;