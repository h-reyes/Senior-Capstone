const path = require('path');
const fs = require('fs');
const express = require('express');
const { requireLogin } = require('../auth/sessionStore');

const router = express.Router();
const viewsPath = path.resolve(__dirname, '..', 'views');
const readmePath = path.resolve(__dirname, '..', 'README.md');
const allowedViews = new Set([
    'home.html',
    'login.html',
    'signup.html',
    'dashboard.html',
    'pet.html',
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

router.get('/api/readme', (req, res) => {
    return res.type('text/markdown').sendFile(readmePath);
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

router.get('/pet', requireLogin, (req, res) => {
    sendView(res, 'pet.html');
});

module.exports = router;
