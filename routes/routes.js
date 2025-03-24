const express = require('express');
const router = express.Router();
const authcontroller = require("../controllers/authController");
const activateController = require('../controllers/activateController');
const authMiddleware = require('../middlewares/authMiddleware');
const roomController = require('../controllers/roomController')

router.post('/send-otp', authcontroller.sendOtp);
router.post('/verify-otp', authcontroller.verifyOtp);
router.post('/activate', authMiddleware, activateController.activate);
router.get('/refresh', authcontroller.refresh);
router.post('/jwt-token', authcontroller.generateJWT);
router.post('/removed-jwt', authcontroller.removedJWT);
router.post('/signout', authMiddleware, authcontroller.logOut);
router.post('/room', authMiddleware, roomController.createRoom);
router.get('/rooms', authMiddleware, roomController.index)
router.get('/user/:email', authMiddleware, authcontroller.getOneUser);


module.exports = router;