var express = require('express');
const router = express.Router();
const homeCtrl = require('../controllers/home');

router.get('/', homeCtrl.index);

module.exports = router;
