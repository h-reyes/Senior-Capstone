const { getSequelize } = require('./sequelize');
const { initModels } = require('./models');

function getModels() {
    const sequelize = getSequelize();

    if (!sequelize) {
        return null;
    }

    return initModels(sequelize);
}

function requestDetails(req) {
    return {
        ipAddress: req.ip || req.socket.remoteAddress || null,
        userAgent: req.get('user-agent') || null,
    };
}

async function initializeAuditStore() {
    const sequelize = getSequelize();

    if (!sequelize) {
        console.log('MySQL audit copy disabled. Add DB_NAME, DB_USER, and DB_HOST to enable it.');
        return false;
    }

    initModels(sequelize);

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('MySQL audit copy connected.');
        return true;
    } catch (error) {
        console.warn('MySQL audit copy unavailable. Continuing without SQL recording.');
        console.warn(error.message);
        return false;
    }
}

async function recordLoginEvent(req, email, eventType) {
    const models = getModels();

    if (!models) {
        return false;
    }

    try {
        await models.LoginEvent.create({
            email,
            eventType,
            ...requestDetails(req),
        });

        return true;
    } catch (error) {
        console.warn(`Skipped MySQL login event copy: ${error.message}`);
        return false;
    }
}

async function recordTransactionCopy(data) {
    const models = getModels();

    if (!models) {
        return false;
    }

    try {
        await models.TransactionCopy.create(data);
        return true;
    } catch (error) {
        console.warn(`Skipped MySQL transaction copy: ${error.message}`);
        return false;
    }
}

module.exports = {
    initializeAuditStore,
    recordLoginEvent,
    recordTransactionCopy,
};
