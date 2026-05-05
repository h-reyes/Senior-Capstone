const fs = require('fs');
const path = require('path');
const express = require('express');
const { requireLogin } = require('../auth/sessionStore');

const router = express.Router();
const assetRoot = path.resolve(__dirname, '..', 'public', 'assets', 'pet');
const manifestPath = path.join(assetRoot, 'shop-items.json');
const assetFolders = ['pets', 'food', 'accessories'];
const allowedExtensions = new Set(['.avif', '.gif', '.jpg', '.jpeg', '.png', '.webp']);
const baseEffectsByFolder = {
    food: { hunger: 22, happiness: 3, energy: -8 },
    accessories: { happiness: 16 },
    pets: { happiness: 10 },
};
const itemTypeByFolder = {
    food: 'food',
    accessories: 'accessory',
    pets: 'pet',
};
const extraordinaryFoodEffect = { hunger: 45, happiness: 6, energy: -12 };

function cleanName(fileName) {
    return path.basename(fileName, path.extname(fileName))
        .replace(/\b(hunger|happiness|energy)-?\d+\b/gi, '')
        .replace(/\bprice\d+(\.\d+)?\b/gi, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function priceForFolder(folderName, rawName) {
    if (rawName.toLowerCase().includes('extraordinary')) {
        return '0.0002';
    }

    if (folderName === 'food') {
        return '0.0001';
    }

    if (folderName === 'accessories') {
        return '0.0002';
    }

    return '0.0003';
}

function effectForAsset(folderName, rawName) {
    const baseEffect = { ...(baseEffectsByFolder[folderName] || {}) };

    if (folderName === 'food' && rawName.toLowerCase().includes('extraordinary')) {
        return { ...extraordinaryFoodEffect };
    }

    return baseEffect;
}

function applyFilenameOverrides(item, rawName) {
    const nextItem = {
        ...item,
        effect: { ...item.effect },
    };
    const effectMatches = rawName.matchAll(/\b(hunger|happiness|energy)(-?\d+)\b/gi);
    const priceMatch = rawName.match(/\bprice(\d+(?:\.\d+)?)\b/i);

    for (const match of effectMatches) {
        nextItem.effect[match[1].toLowerCase()] = Number(match[2]);
    }

    if (priceMatch) {
        nextItem.priceEth = priceMatch[1];
    }

    return nextItem;
}

function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        return null;
    }
}

function applySidecarOverrides(item, imagePath) {
    const sidecarPath = imagePath.replace(path.extname(imagePath), '.json');
    const overrides = readJsonFile(sidecarPath);

    if (!overrides || typeof overrides !== 'object') {
        return item;
    }

    return {
        ...item,
        name: typeof overrides.name === 'string' ? overrides.name : item.name,
        priceEth: typeof overrides.priceEth === 'string' ? overrides.priceEth : item.priceEth,
        effect: {
            ...item.effect,
            ...(overrides.effect && typeof overrides.effect === 'object' ? overrides.effect : {}),
        },
    };
}

function readManifestItems() {
    const manifest = readJsonFile(manifestPath);

    if (!manifest || !Array.isArray(manifest.items)) {
        return [];
    }

    return manifest.items.map((item) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        src: item.src || '',
        priceEth: item.priceEth,
        effect: item.effect || {},
    })).filter((item) => item.id && item.type && item.name && item.priceEth);
}

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
        .map((entry) => {
            const rawName = path.basename(entry.name, path.extname(entry.name));
            const filePath = path.join(folderPath, entry.name);
            const item = {
                id: `${folderName}-${entry.name}`,
                type: itemTypeByFolder[folderName],
                name: cleanName(entry.name),
                src: `/assets/pet/${folderName}/${encodeURIComponent(entry.name)}`,
                priceEth: priceForFolder(folderName, rawName),
                effect: effectForAsset(folderName, rawName),
            };

            return applySidecarOverrides(applyFilenameOverrides(item, rawName), filePath);
        });
}

router.get('/api/pet-assets', requireLogin, (req, res) => {
    return res.json({
        defaults: readManifestItems(),
        pets: listImageAssets('pets'),
        food: listImageAssets('food'),
        accessories: listImageAssets('accessories'),
    });
});

module.exports = router;
