const express = require('express');
const { purge } = require('../controllers/Purge');

const router = express.Router();

router.get('/', purge.index);
router.get('/:day', purge.show);

module.exports = router;
