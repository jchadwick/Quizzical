declare var exports: any;

var ConnectedUsers = require('./ConnectedUsers'),
    QuizSession = require('./QuizSession');

function initializeRestApi(app, server) {
    
    app.get('/api/sessions/:sessionId/users', (req, res) => {
        res.json(ConnectedUsers.getUsersInSession(req.params.sessionId));
    });

    app.post('/api/sessions/:sessionId/questions/:questionId/select', (req, res) => {
        new QuizSession(server).changeQuestionId(req.params.questionId);
        res.send('OK');
    });

    console.log('REST API initialized');
};


module['exports'] = exports = initializeRestApi;
