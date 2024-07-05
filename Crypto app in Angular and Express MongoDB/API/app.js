const { get_today_market_data, updateCoinsData } = require("./mongodb/fear_greed_index")
const { updateCoinData } = require("./mongodb/coins")
var fs = require("fs")

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var schedule = require("node-schedule")


var getTodayMarketData = schedule.scheduleJob("*/00 00 * * *", get_today_market_data)

var updateCoins = schedule.scheduleJob("*/00 00 * * *", async function(data){
  var rawData = fs.readFileSync("./data/toUpdate.json");
  var data = JSON.parse(rawData);
  var now = Date.now()
  for(let i = 0; i < data.length; i++){
    setTimeout(await updateCoinData(data[i], "24h"), now)
    now += 30000
  }
})


var usersRouter = require('./routes/users');
var allCoinsRouter = require('./routes/ranking');
var coinRouter = require('./routes/coinDetails');
var otherRouter = require('./routes/others')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/ranking',allCoinsRouter);
app.use('/coins',coinRouter);
app.use('/',otherRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
