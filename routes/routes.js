const express = require('express');
const router = express.Router();
const authcontroller = require("../controllers/authController");
const activateController = require('../controllers/activateController');


router.post('/send-otp', authcontroller.sendOtp);
router.post('/verify-otp', authcontroller.verifyOtp);
router.post('/activate', activateController.activate);



module.exports = router;