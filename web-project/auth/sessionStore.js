const crypto = require('crypto');

const SESSION_COOKIE = 'sessionId';
const sessions = new Map();

function createSession(email) {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { email, createdAt: Date.now() });
    return sessionId;
}

function parseCookies(cookieHeader = '') {
    return cookieHeader.split(';').reduce((cookies, cookie) => {
        const [rawName, ...rawValue] = cookie.trim().split('=');

        if (!rawName) {
            return cookies;
        }

        try {
            cookies[rawName] = decodeURIComponent(rawValue.join('='));
        } catch (error) {
            cookies[rawName] = '';
        }

        return cookies;
    }, {});
}

function getSession(req) {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies[SESSION_COOKIE];

    if (!sessionId) {
        return null;
    }

    return sessions.get(sessionId) || null;
}

function requireLogin(req, res, next) {
    const session = getSession(req);

    if (!session) {
        return res.redirect('/login');
    }

    req.user = session;
    return next();
}

function setSessionCookie(res, sessionId) {
    res.cookie(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60,
    });
}

module.exports = {
    createSession,
    requireLogin,
    setSessionCookie,
};
