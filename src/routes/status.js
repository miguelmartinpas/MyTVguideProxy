const express = require('express');
const { status } = require('../controllers/Status');

const router = express.Router();

router.get('/', status.index);

module.exports = router;
