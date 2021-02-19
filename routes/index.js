var express = require('express');
var app = express();
const homeCtrl = require('../controllers/home');

app.get('/', homeCtrl.index);

module.exports = app;
