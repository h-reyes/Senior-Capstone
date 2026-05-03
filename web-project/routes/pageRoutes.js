const path = require('path');
const express = require('express');

const router = express.Router();
const viewsPath = path.join(__dirname, '..', 'views');

router.get('/', (req, res) => {
    res.sendFile(path.join(viewsPath, 'home.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(viewsPath, 'login.html'));
});

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(viewsPath, 'dashboard.html'));
});

module.exports = router;
