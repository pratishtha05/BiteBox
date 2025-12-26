const express = require('express');
const router = express.Router();

// Example admin route
router.get('/test', (req, res) => {
    res.send('test admin route');
});

module.exports = router;