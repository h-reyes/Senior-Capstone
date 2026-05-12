const express = require('express');
const { requireLogin } = require('../auth/sessionStore');
const { recordTransactionCopy } = require('../db/auditStore');

const router = express.Router();

function isAddress(value) {
    return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);
}

function isTransactionHash(value) {
    return typeof value === 'string' && /^0x[a-fA-F0-9]{64}$/.test(value);
}

router.post('/api/transactions', requireLogin, async (req, res) => {
    const {
        walletAddress,
        burnContractAddress,
        chainId,
        transactionHash,
        itemId,
        itemName,
        itemType,
        priceEth,
    } = req.body;

    if (!isAddress(walletAddress) || !isAddress(burnContractAddress) || !isTransactionHash(transactionHash)) {
        return res.status(400).json({ error: 'Invalid transaction details.' });
    }

    if (!chainId || !itemId || !itemName || !itemType || !priceEth) {
        return res.status(400).json({ error: 'Missing transaction details.' });
    }

    try {
        await recordTransactionCopy({
            email: req.user.email,
            walletAddress,
            burnContractAddress,
            chainId,
            transactionHash,
            itemId,
            itemName,
            itemType,
            priceEth,
        });

        return res.status(201).json({ success: true });
    } catch (error) {
        console.warn(`Skipped MySQL transaction copy: ${error.message}`);
        return res.status(202).json({ success: true });
    }
});

module.exports = router;
