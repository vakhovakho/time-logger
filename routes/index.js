var express = require('express');
var app = express();

app.get('/', (req, res) => {
	res.send(req.session);
});

module.exports = app;
