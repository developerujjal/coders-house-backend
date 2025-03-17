const express = require('express');
const router = express.Router();
const authcontroller = require("../controllers/authController");
const activateController = require('../controllers/activateController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/send-otp', authcontroller.sendOtp);
router.post('/verify-otp', authcontroller.verifyOtp);
router.post('/activate', authMiddleware, activateController.activate);
router.get('/refresh', authcontroller.refresh)



module.exports = router;