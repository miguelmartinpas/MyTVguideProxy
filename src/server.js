// https://www.airpair.com/node.js/posts/top-10-mistakes-node-developers-make
const express = require('express');
const { cacheMiddleware } = require('./middlewares/caching');
const { authMiddleware } = require('./middlewares/Auth');
const { keepMeAlive } = require('./services/KeepMeAlive');
const { programmes } = require('./controllers/Programmes');
const config = require('../config');

const PORT = process.env.PORT || 3000;

const app = express();
cacheMiddleware.attach(app);

app.listen(PORT, () => {
    /* eslint-disable no-console */
    console.info('Server started in port 3000');
    /* eslint-enable no-console */
});

// mildeware to check auth
app.use(authMiddleware.execute);

// tv-programmes
app.get('/tv-programmes', programmes.index);
app.get('/tv-programmes/:day', programmes.show);

const { mode, host, port } = config.hostConfig;
keepMeAlive.execute(mode, host, port);
