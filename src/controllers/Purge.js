const { api } = require('../services/Api');

class Purge {
    /* eslint-disable class-methods-use-this */
    async index(req, res) {
        let data = {};
        try {
            data = await api.purge();
        } catch (error) {
            data = { error: error.message };
        }
        return res.json(data);
    }
    /* eslint-enable class-methods-use-this */

    /* eslint-disable class-methods-use-this */
    async show(req, res) {
        let data = {};
        const { day } = req.params;
        try {
            data = await api.purge(day);
        } catch (error) {
            data = { error: error.message };
        }
        return res.json(data);
    }
    /* eslint-enable class-methods-use-this */
}

module.exports = {
    purge: new Purge(),
};
