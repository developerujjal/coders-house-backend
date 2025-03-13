const express = require('express');
const router = express.Router();
const authcontroller = require("../controllers/authController");


router.post('/send-otp', authcontroller.sendOtp);
router.post('/verfy-otp', authcontroller.verifyOtp)



module.exports = router;