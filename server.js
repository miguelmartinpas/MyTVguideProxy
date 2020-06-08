const config = require('./config');
const app = require('./src/app');

app.listen(config.globalConfig.port, () => {
    /* eslint-disable no-console */
    console.info(`MyTVGuideProxy Server started in port ${config.globalConfig.port}`);
    /* eslint-enable no-console */
});
