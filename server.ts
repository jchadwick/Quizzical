/// <reference path="app/model.ts" />
declare var require, __dirname, process;

var express = require('express'),
    http = require('http'),
    socketIo = require('socket.io');

var app = express(),
    server = http.Server(app),
    io = socketIo(server);

var connectedUsers = [];


app.use(express.static(__dirname));


var router = express.Router(); 

router.get('/users', (req, res) => {
    res.json(connectedUsers);
});

router.post('/sessions/:sessionId/question/:questionId', (req, res) => {
    var questionId = req.params.questionId;

    changeQuestionId(questionId);

    res.json(questionId);
});

app.use('/api', router);

io.on('connection', socket => {

    var user = connectUser(socket.id);
    console.log('user.connected: ', user);
    socket.broadcast.emit('user.connected', user);

    socket.on('disconnect', () => {
        var user = disconnectUser(socket.id);
        console.log('user.disconnected: ', user);
        socket.broadcast.emit('user.disconnected', user);
    });

});


var port = process.env.port || 3000;
server.listen(port, () => {
    console.log('listening on *:' + port);
});


function changeQuestionId(questionId: number) {
    console.log('broadcasting currentQuestionId: ' + questionId);
    io.emit('question.changed', { questionId: questionId });
}

function getConnectedUser(userId: string) {
    var users = connectedUsers.filter(u => u.id == userId);
    return users.length ? users[0] : null;
}

function disconnectUser(userId: string) {
    var user = getConnectedUser(userId),
        index = connectedUsers.indexOf(user);

    if (index) {
        connectedUsers.splice(index, 1);
    }

    return user;
}

function connectUser(userId: string) {
    var user = getConnectedUser(userId);

    if (!user) {
        var username = userId;  // TODO: Fetch username
        user = <Quizzical.User>{ id: userId, name: username };
        connectedUsers.push(user);
    }

    return user;
}


