const path = require('path');
const express = require('express');
const { requireLogin } = require('../auth/sessionStore');

const router = express.Router();
const viewsPath = path.resolve(__dirname, '..', 'views');
const allowedViews = new Set([
    'home.html',
    'login.html',
    'signup.html',
    'dashboard.html',
]);

function sendView(res, fileName) {
    if (!allowedViews.has(fileName)) {
        return res.status(404).send('Not found');
    }

    const filePath = path.resolve(viewsPath, fileName);
    const relativePath = path.relative(viewsPath, filePath);

    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        return res.status(403).send('Forbidden');
    }

    return res.sendFile(filePath);
}

router.get('/', (req, res) => {
    sendView(res, 'home.html');
});

router.get('/login', (req, res) => {
    sendView(res, 'login.html');
});

router.get('/signup', (req, res) => {
    sendView(res, 'signup.html');
});

router.get('/dashboard', requireLogin, (req, res) => {
    sendView(res, 'dashboard.html');
});

module.exports = router;
