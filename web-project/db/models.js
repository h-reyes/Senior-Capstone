const { DataTypes } = require('sequelize');

let models = null;

function initModels(sequelize) {
    if (models) {
        return models;
    }

    const LoginEvent = sequelize.define('LoginEvent', {
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        eventType: {
            type: DataTypes.ENUM('login_success', 'login_failed', 'signup_success', 'logout'),
            allowNull: false,
        },
        ipAddress: {
            type: DataTypes.STRING(64),
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'login_events',
        underscored: true,
    });

    const TransactionCopy = sequelize.define('TransactionCopy', {
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        walletAddress: {
            type: DataTypes.STRING(42),
            allowNull: false,
        },
        burnContractAddress: {
            type: DataTypes.STRING(42),
            allowNull: false,
        },
        chainId: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        transactionHash: {
            type: DataTypes.STRING(66),
            allowNull: false,
            unique: true,
        },
        itemId: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        itemName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        itemType: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        priceEth: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
    }, {
        tableName: 'transaction_copies',
        underscored: true,
    });

    models = {
        LoginEvent,
        TransactionCopy,
    };

    return models;
}

module.exports = {
    initModels,
};
