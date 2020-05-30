const { apiInstance } = require('../services/Api');

class Programmes {
    /* eslint-disable class-methods-use-this */
    async index(req, res) {
        let data = {};
        try {
            data = await apiInstance.fetchDateForCurrentDay();
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
            data = await apiInstance.fetchDate(day);
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
