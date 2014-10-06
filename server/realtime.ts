declare var exports: any;

var socketIo = require('socket.io'),
    quizSession = require('./QuizSession');

module['exports'] = exports = (server) => {
    var io = socketIo(server),
        session = new quizSession(server);

    io.on('connection', socket => {

        console.log('connection: ', socket.id);
        var user = session.connectUser(socket.id);
        console.log('user.connected: ', user);
        socket.broadcast.emit('user.connected', user);

        socket.on('disconnect', () => {
            console.log('user.disconnected: ', socket.id);
            session.disconnectUser(socket.id);
            socket.broadcast.emit('user.disconnected', user);
        });

    });

    console.log('realtime module initialized');
}