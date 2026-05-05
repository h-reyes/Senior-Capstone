require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

const config = {
    solidity: '0.8.20',
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL || '',
            accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
        },
    },
};

module.exports = config;
