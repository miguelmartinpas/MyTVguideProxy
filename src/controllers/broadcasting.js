const api = require('../services/api');

const index = async () => {
    let data = {};
    try {
        data = await api.fetchDateForCurrentDay();
    } catch (error) {
        data = { error };
    }
    return data;
};

const show = async (day) => {
    let data = {};
    try {
        data = await api.fetchDate(day);
    } catch (error) {
        data = { error: error.message };
    }
    return data;
};

module.exports = {
    index,
    show,
};
