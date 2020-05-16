const { api } = require('../services/Api');

class Programmes {
    /* eslint-disable class-methods-use-this */
    async index(req, res) {
        let data = {};
        try {
            data = await api.fetchDateForCurrentDay();
        } catch (error) {
            data = { error: error.message };
        }
        return res.json(data);
    }

    async show(req, res) {
        let data = {};
        const { day } = req.params;
        try {
            data = await api.fetchDate(day);
        } catch (error) {
            data = { error: error.message };
        }
        return res.json(data);
    }
    /* eslint-enable class-methods-use-this */
}

module.exports = {
    programmes: new Programmes(),
};
