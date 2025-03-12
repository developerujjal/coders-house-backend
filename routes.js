const express = require('express');
const router = express.Router();


router.get('/welcome', (req, res) => {
    res.send("Kire re avai kie kiro ei kahane")
})



module.exports = router;