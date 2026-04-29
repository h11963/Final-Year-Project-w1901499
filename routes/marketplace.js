const express = require('express');
const router = express.Router();


router.get('/test', (req, res) => {
    res.send('Marketplace route test successful!');
});

module.exports = router;