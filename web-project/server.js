const path = require('path');
require('dotenv').config();

const express = require('express');
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const petAssetRoutes = require('./routes/petAssetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { initializeAuditStore } = require('./db/auditStore');

const app = express();
const port = process.env.PORT || 5000;

function blockDirectoryTraversal(req, res, next) {
    let decodedUrl = req.url;

    for (let i = 0; i < 3; i += 1) {
        try {
            const nextDecodedUrl = decodeURIComponent(decodedUrl);

            if (nextDecodedUrl === decodedUrl) {
                break;
            }

            decodedUrl = nextDecodedUrl;
        } catch (error) {
            return res.status(400).send('Bad request');
        }
    }

    const normalizedUrl = decodedUrl.replace(/\\/g, '/').toLowerCase();

    if (normalizedUrl.includes('../') || normalizedUrl.includes('/..') || normalizedUrl.includes('..;')) {
        return res.status(403).send('Forbidden');
    }

    return next();
}

app.use(blockDirectoryTraversal);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), {
    dotfiles: 'deny',
    index: false,
}));

app.use(authRoutes);
app.use(transactionRoutes);
app.use(petAssetRoutes);
app.use(pageRoutes);

async function startServer() {
    await initializeAuditStore();

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer();
