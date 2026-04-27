const express = require('express');
const router = express.Router();

// Root endpoint
router.get('/', (req, res) => {
    res.send('Welcome to OpenClaw API!');
});

module.exports = router;