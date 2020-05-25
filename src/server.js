const express = require('express');
const config = require('../config');
const cacheMiddleware = require('./middlewares/caching');
const authMiddleware = require('./middlewares/Auth');
const programmesRouter = require('./routes/programmes');
const purgeRouter = require('./routes/purge');
const preloadRouter = require('./routes/preload');
const statusRouter = require('./routes/status');

const app = express();
app.listen(config.globalConfig.port, () => {
    /* eslint-disable no-console */
    console.info(`Server started in port ${config.globalConfig.port}`);
    /* eslint-enable no-console */
});

// midleware cache + check auth
cacheMiddleware.attach(app);
app.use(authMiddleware.execute);

// routes
app.use('/tv-programmes', programmesRouter);
app.use('/purge', purgeRouter);
app.use('/preload', preloadRouter);
app.use('/status', statusRouter);
