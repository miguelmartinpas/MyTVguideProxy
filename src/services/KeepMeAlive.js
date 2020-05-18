const fetch = require('node-fetch');

const MINUTES = 29 * 60;
const TIME_TO_REPEAT = MINUTES * 1000;

class KeepMeAlive {
    execute(mode, host, port) {
        /* eslint-disable no-console */
        console.log(
            `keepMeAlive will be run in ${TIME_TO_REPEAT / 1000} seconds (${TIME_TO_REPEAT / (60 * 1000)} minutes)`,
            `${this.getUrl(mode, host, port)}`
        );
        /* eslint-enable no-console */
        setTimeout(() => {
            this.keepMeAlive(mode, host, port);
        }, TIME_TO_REPEAT);
    }

    /* eslint-disable class-methods-use-this */
    getUrl(mode, host, port) {
        return port === 'none' ? `${mode}://${host}/` : `${mode}://${host}:${port}/`;
    }
    /* eslint-enable class-methods-use-this */

    keepMeAlive(mode, host, port) {
        fetch(this.getUrl(mode, host, port)).then((response) => {
            /* eslint-disable no-console */
            console.log(
                'KeepMeAlive > executed',
                new Date().toISOString(),
                response.url,
                response.status,
                response.statusText
            );
            /* eslint-enable no-console */
            if ((response.status === 401, response.statusText === 'Unauthorized')) {
                this.execute(mode, host, port);
            }
        });
    }
}

module.exports = {
    keepMeAlive: new KeepMeAlive(),
};
