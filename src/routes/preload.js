const express = require('express');
const { preload } = require('../controllers/Preload');

const router = express.Router();

router.get('/', preload.index);
router.get('/:day', preload.show);

module.exports = router;
