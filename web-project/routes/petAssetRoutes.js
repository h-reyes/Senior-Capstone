const fs = require('fs');
const path = require('path');
const express = require('express');
const { requireLogin } = require('../auth/sessionStore');

const router = express.Router();
const assetRoot = path.resolve(__dirname, '..', 'public', 'assets', 'pet');
const assetFolders = ['pets', 'food', 'accessories'];
const allowedExtensions = new Set(['.avif', '.gif', '.jpg', '.jpeg', '.png', '.webp']);

function listImageAssets(folderName) {
    if (!assetFolders.includes(folderName)) {
        return [];
    }

    const folderPath = path.resolve(assetRoot, folderName);
    const relativePath = path.relative(assetRoot, folderPath);

    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        return [];
    }

    if (!fs.existsSync(folderPath)) {
        return [];
    }

    return fs.readdirSync(folderPath, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .filter((entry) => allowedExtensions.has(path.extname(entry.name).toLowerCase()))
        .map((entry) => ({
            name: path.basename(entry.name, path.extname(entry.name)).replace(/[-_]+/g, ' '),
            src: `/assets/pet/${folderName}/${encodeURIComponent(entry.name)}`,
        }));
}

router.get('/api/pet-assets', requireLogin, (req, res) => {
    return res.json({
        pets: listImageAssets('pets'),
        food: listImageAssets('food'),
        accessories: listImageAssets('accessories'),
    });
});

module.exports = router;
