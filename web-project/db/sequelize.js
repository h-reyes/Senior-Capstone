const { Sequelize } = require('sequelize');

let sequelize = null;

function isDatabaseConfigured() {
    return Boolean(process.env.DB_NAME && process.env.DB_USER && process.env.DB_HOST);
}

function getSequelize() {
    if (!isDatabaseConfigured()) {
        return null;
    }

    if (!sequelize) {
        sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD || '',
            {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 3306,
                dialect: 'mysql',
                logging: false,
            }
        );
    }

    return sequelize;
}

module.exports = {
    getSequelize,
    isDatabaseConfigured,
};
