const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const validEmail = 'user@example.com';
    const validPassword = 'password123';

    if (email === validEmail && password === validPassword) {
        return res.json({ success: true });
    }

    return res.status(401).json({ error: 'Invalid email or password.' });
});

module.exports = router;
