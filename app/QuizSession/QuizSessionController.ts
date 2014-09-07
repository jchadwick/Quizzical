/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Quizzical {
    'use strict';

    interface QuizSessionViewModel {
        quiz: Quiz;
        currentQuestion: QuizSessionQuestionViewModel;

        totalQuestions(): number;
        sessions: Quizzical.QuizSession[]
    }

    interface QuizSessionQuestionViewModel {
        question: string;
        extendedDescription: string;
        options: QuestionOption;
        answer: Answer;

        hasExtendedDescription(): boolean;
        hasOptions(): boolean;
        hasAnswer(): boolean;
    }

    class QuizSessionController {

        static $inject = [ '$scope', 'QuizSessionService' ];

        constructor(
            private $scope: QuizSessionViewModel,
            private sessionService: IQuizSessionService) {

            this.loadSessions();
        }

        loadSessions() {
            this.sessionService.list().then(sessions => {
                this.$scope.sessions = sessions;
            });
        }
    }

    angular.module('Quizzical').controller('QuizSessionController', QuizSessionController);
}