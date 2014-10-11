declare var require, __dirname, process;

var express = require('express'),
    http = require('http'),
    api = require('./server/api'),
    livereload = require('express-livereload'),
    ConnectedUsers = require('./server/ConnectedUsers');

var app = express(),
    server = http.Server(app);

ConnectedUsers.init(server);

app.use(express.static(__dirname + '/app'));
app.use('/app', express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

api(app, server);

livereload(app, {});

var port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('listening on *:' + port);
});