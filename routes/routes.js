const express = require('express');
const router = express.Router();
const authcontroller = require("../controllers/authController");


router.get('/send-otp', authcontroller.sendOtp);



module.exports = router;