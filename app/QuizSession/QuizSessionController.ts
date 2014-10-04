/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Quizzical {
    'use strict';

    interface ConnectedUserViewModel extends User {
    }

    export interface QuizSessionViewModel extends ng.IScope {
        sessionId: number;
        quizId: number;
        questionId?: number;
        quizName: string;
        totalQuestions: number;

        connectedUsers: User[];

        quiz: Quiz;
    }

    export class QuizSessionController {

        static $inject = ['$log', '$scope', 'QuizService', 'QuizSessionService' ];

        constructor(
            private $log: ng.ILogService,
            private $scope: QuizSessionViewModel,
            private quizService: IQuizService,
            private sessionService: IQuizSessionService) {

            $log.debug('[QuizSessionController] Init');

            $scope.connectedUsers = [];

            if (!$scope.sessionId) {
                $log.warn('[QuizSessionController] Invalid Session ID');
                return;
            }

            if ($scope.quizId) {
                $log.debug('[QuizSessionController] Quiz ID set on scope...');
                loadQuiz();
            } else {
                $log.debug('[QuizSessionController] No Quiz ID set on scope - loading session to get quiz ID...');

                sessionService.getById($scope.sessionId).then((session: QuizSession) => {
                    $scope.quizId = session.quizId;

                    (session.connectedUserIds || []).forEach(addConnectedUser);

                    loadQuiz();
                });
            }

            function getConnectedUser(userId: string) {
                var users = $scope.connectedUsers.filter(u => u.id == userId);
                return users.length ? users[0] : null;
            }

            function removeConnectedUser(userId: string) {
                var user = getConnectedUser(userId),
                    index = $scope.connectedUsers.indexOf(user);

                if (index) {
                    $scope.connectedUsers.splice(index, 1);
                }
            }

            function addConnectedUser(userId: string) {
                var user = getConnectedUser(userId);

                if (user) return;

                var username = userId;  // TODO: Fetch username
                $scope.connectedUsers.push(<ConnectedUserViewModel>{ id: userId, name: username });
            }

            function loadQuiz() {
                $log.debug('[QuizSessionController] Loading quiz ' + $scope.quizId + '...');

                quizService.getById($scope.quizId).then((quiz: Quiz) => {
                    $log.debug('[QuizSessionController] Loaded quiz: ', quiz);
                    $scope.quiz = quiz;
                    $scope.quizName = quiz ? quiz.name : '';
                    $scope.totalQuestions = (quiz && quiz.questions) ? quiz.questions.length : 0;
                });
            }

            $scope.$on('question.changed', (args, data) => {
                $scope.questionId = data.questionId;
                if(!$scope.$$phase) $scope.$apply();
            });

            $scope.$on('user.connected', (args, data) => {
                addConnectedUser(data.userId);
            });
            $scope.$on('user.disconnected', (args, data) => {
                removeConnectedUser(data.userId);
            });
        }
    }

    angular.module('Quizzical.UI').controller('QuizSessionController', QuizSessionController);
}