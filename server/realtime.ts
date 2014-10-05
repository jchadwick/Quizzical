declare var exports: any;

var socketIo = require('socket.io'),
    quizSession = require('./QuizSession');

exports = (server) => {
    var io = socketIo(server),
        session = new quizSession(server);

    io.on('connection', socket => {

        var user = session.connectUser(socket.id);
        console.log('user.connected: ', user);
        socket.broadcast.emit('user.connected', user);

        socket.on('disconnect', () => {
            session.disconnectUser(socket.id);
            console.log('user.disconnected: ', user);
            socket.broadcast.emit('user.disconnected', user);
        });

    });    
}