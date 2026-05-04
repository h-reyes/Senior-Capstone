const path = require('path');
const express = require('express');
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

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

app.use(pageRoutes);
app.use(authRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
