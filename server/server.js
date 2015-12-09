'use strict';

var logger = require('./util/logger')(module);
var express = require('express');
var app = express();
var session = require('express-session')({
  secret: 'webpack ng',
  resave: false,
  saveUninitialized: false
});
var morgan = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');
var path = require('path');
var root = path.join(__dirname, '../dist');
var indexPath = path.join(root, 'index.html');
var config = require('./config');
var server = require('./socket')(app).server;
var io = require('./socket')();

app.use(session);
app.use(morgan('combined', {
  'stream': logger.stream
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  'extended': false
}));
app.use(compression());
app.use(express.static(root));
app.use('/api', require('./route/api'));
app.get('*', function(req, res) {
  res.sendFile(indexPath);
});

server
  .listen(config.PORT, function(err) {
    logger.info('Our app is running on http://localhost:' + config.PORT);
  })
  .on('error', function(err) {
    if (err.code === 'EADDRINUSE') {
      logger.error('The port is already in use..!!');
    }
  });

module.exports = app;
