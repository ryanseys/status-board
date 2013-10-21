const express = require('express');
const routes = require('./routes');
const http = require('http');
const path = require('path');
const request = require('request');

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development environment only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

//return site response time in ms
function get_site_response_time(host, callback) {
  var start = Date.now();
  request('https://ryanseys.com/up', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if(body == 'yep\n') {
        var dur = Date.now() - start;
        console.log("Site is up and responded in " + dur + " ms.");
        callback(dur);
      }
      else {
        console.log('SITE IS DOWN');
      }
    }
    else {
      callback(null);
    }
  });
}

var ghfollows;

setInterval(function() {
  get_github_profile_stats('ryanseys', function(stats) {
    if(stats) {
      ghfollows = stats.followers;
      console.log('ghfollows: ' + ghfollows);
    }
  });
}, 1000*60*5); // 5 min

function get_github_profile_stats(username, callback) {
  request('https://api.github.com/users/'+username, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(JSON.parse(body));
    }
    else {
      callback(null);
    }
  });
}

setInterval(function() {
  get_site_response_time('ryanseys.com', function(milliseconds) {
    io.sockets.emit('resptime', { ms: milliseconds });
  });
}, 10000);

io.sockets.on('connection', function (socket) {
  socket.emit('ghfollows', { followers: 206 });
  socket.emit('twitterfollowers', { followers: 225 });
  socket.emit('githubrepos', { repos: 64 });
  socket.emit('resptime', { ms : 100 });
});
