const express = require('express');
const { createSession, setSessionCookie } = require('../auth/sessionStore');

const router = express.Router();

const users = [
    {
        name: 'Test User',
        email: 'user@example.com',
        password: 'password123',
    },
];

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find((account) => account.email === email);

    if (user && user.password === password) {
        const sessionId = createSession(user.email);
        setSessionCookie(res, sessionId);
        return res.json({ success: true });
    }

    return res.status(401).json({ error: 'Invalid email or password.' });
});

router.post('/signup', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Please complete every field.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const existingUser = users.find((account) => account.email === email);

    if (existingUser) {
        return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    users.push({ name, email, password });

    return res.status(201).json({ success: true });
});

module.exports = router;
