﻿declare var exports: any;

var quizSession = require('./QuizSession');

module['exports'] = exports = (app, server) => {
    
    var session = new quizSession(server);

    app.get('/api/users', (req, res) => {
        res.json(session.getConnectedUsers());
    });

    app.post('/api/sessions/:sessionId/questions/:questionId/select', (req, res) => {
        session.changeQuestionId(req.params.questionId);
        res.send('OK');
    });

    console.log('REST API initialized');
};
