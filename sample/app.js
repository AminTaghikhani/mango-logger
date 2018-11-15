var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {
    LOGGER
} = require('../');
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(LOGGER.request({
    saveFormat: 'date'
}))
app.get('/', (req, res) => res.send('hi'))

module.exports = app;