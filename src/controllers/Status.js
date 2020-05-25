const fetch = require('node-fetch');

class Status {
    /* eslint-disable class-methods-use-this */
    index(req, res) {
        const { callback, timeinseconds } = req.headers;
        if (callback && timeinseconds) {
            /* eslint-disable no-console */
            console.log(`it will call to '${callback}' in ${timeinseconds} seconds...`);
            /* eslint-enable no-console */
            setTimeout(() => {
                /* eslint-disable no-console */
                console.log(`calling to '${callback}' ...`);
                /* eslint-enable no-console */
                fetch(`${callback}?time=${new Date().toString()}`);
            }, timeinseconds * 1000);
        }
        return res.json({ status: 'ok' });
    }
    /* eslint-enable class-methods-use-this */
}

module.exports = {
    status: new Status(),
};
