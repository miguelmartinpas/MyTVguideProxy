const express = require('express');
const { programmes } = require('../controllers/Programmes');

const router = express.Router();

router.get('/', programmes.index);
router.get('/:day', programmes.show);

module.exports = router;
