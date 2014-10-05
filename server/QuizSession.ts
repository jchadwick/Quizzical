var io = require('socket.io');

var connectedUsers = [];

class QuizSession {
    private socket;

    constructor(server) {
        this.socket = io(server);
    }

    changeQuestionId(questionId: number) {
        console.log('broadcasting currentQuestionId: ' + questionId);
        this.socket.emit('question.changed', { questionId: questionId });
    }

    connectUser(userId: string) {
        var user = this.getConnectedUser(userId);

        if (!user) {
            var username = userId;  // TODO: Fetch username
            user = <Quizzical.User>{ id: userId, name: username };
            connectedUsers.push(user);
        }

        return user;
    }

    disconnectUser(userId: string) {
        var user = this.getConnectedUser(userId),
            index = connectedUsers.indexOf(user);

        if (index) {
            connectedUsers.splice(index, 1);
        }

        return user;
    }

    getConnectedUser(userId: string) {
        var users = connectedUsers.filter(u => u.id == userId);
        return users.length ? users[0] : null;
    }

    getConnectedUsers() {
        return connectedUsers;
    }

}

module.exports = exports = QuizSession;