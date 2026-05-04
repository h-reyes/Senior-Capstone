const express = require('express');
const {
    clearSessionCookie,
    createSession,
    destroySession,
    setSessionCookie,
} = require('../auth/sessionStore');

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

router.post('/logout', (req, res) => {
    destroySession(req);
    clearSessionCookie(res);
    return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="refresh" content="2;url=/" />
            <title>Logged Out</title>
            <link rel="stylesheet" href="/styles.css" />
        </head>
        <body>
            <main class="login-shell">
                <section class="login-card" aria-labelledby="logout-title">
                    <div class="brand-mark" aria-hidden="true">S</div>
                    <h1 id="logout-title">Successfully logged out</h1>
                    <p>Redirecting to home.</p>
                    <a class="primary-link" href="/">Go home now</a>
                </section>
            </main>
        </body>
        </html>
    `);
});

module.exports = router;
