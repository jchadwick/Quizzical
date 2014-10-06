declare var exports: any;

var io = require('socket.io')();

module Quizzical.Server {

    class QuizSession {

        changeQuestionId(questionId: number) {
            console.log('broadcasting currentQuestionId: ' + questionId);
            io.emit('question.changed', { questionId: questionId });
        }

    }

    module['exports'] = exports = QuizSession;
}
