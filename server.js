#!/usr/bin/env node

var theme = require('./lib/theme');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
const themeRouter = express.Router();
var minify = require('express-minify');
var compress = require('compression');
var port = process.env.PORT || 3000;

const serverless = require('serverless-http');

app.disable('x-powered-by');
app.use(compress());
app.use(minify(
{
  cache: __dirname + '/cache'
}));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next();
});
app.use(bodyParser.json())
app.use(cors());

themeRouter.use("/themes.json", express.static('themes.json'));
themeRouter.get('/:theme', theme);
themeRouter.post('/:theme', theme);

themeRouter.get('/theme/:theme', theme);
themeRouter.post('/theme/:theme', theme);

app.use(process.env.INSTANCE_BASE_PATH || "/", themeRouter);

console.log("Starting theme-manager..");

if (!process.env.IS_SERVERLESS) {
  app.listen(port, function () {
    console.log('Server is now running at http://localhost:' + port + '/');
  });
}

module.exports.handler = serverless(app);
