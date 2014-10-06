declare var exports: any;

var io = require('socket.io');

module Quizzical.Server {

    export interface IConnectedUser {
        id: string;
        displayName: string;
        connectionId: string;
    }

    export interface IConnectedUsers {
        getUsersInSession(sessionId?: string): any[];
    }

    var connections = [];

    function getUser(connectionId) {
        return <IConnectedUser>{ id: connectionId, displayName: 'anonymous', connectionId: connectionId };
    }

    class ConnectedUsers implements IConnectedUsers {

        static init(server) {
            io(server).on('connection', socket => {

                var connectionId = socket.id;

                connections.push(connectionId);

                // #Connect
                console.log('connection: ', connectionId);
                var user = getUser(connectionId);
                socket.broadcast.emit('user.connected', user);

                // #Disconnect
                socket.on('disconnect', () => {
                    connections.splice(connections.indexOf(connectionId), 1);
                    socket.broadcast.emit('user.disconnected', user);
                });
            });
        }

        getUsersInSession(quizSessionId: string) {
            return connections.map(getUser);
        }
    }

    var instance = new ConnectedUsers();
    module['exports'] = exports = instance;
    exports.init = ConnectedUsers.init;
}
