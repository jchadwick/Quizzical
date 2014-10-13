/// <reference path="model.ts" />

module Quizzical.App {

    function routing($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise("/sessions/1");

        $stateProvider
            .state('Sessions', {
                url: "/sessions",
                templateUrl: "/app/SessionList/SessionList.tmpl.html",
                controller: 'SessionListController'
            })
            .state('Session', {
                url: "/sessions/:sessionId",
                template: "<div qz-quiz-session sessionid='{{sessionId}}'></div>",
                controller: ($scope, $stateParams) => {
                    $scope.sessionId = $stateParams.sessionId;
                }
            });

    }

    angular.module('Quizzical.App', ['Quizzical.Services', 'Quizzical', 'Quizzical.UI', 'ui.router'])
        .config(routing)
        .run(['$log', '$rootScope', '$location', '$controller',
        ($log, $scope: ng.IScope, $location: ng.ILocationService) => {

            $log.info('Initializing application...');

            $scope.$on('session.joined', (args, data) => {
                $log.debug('Navigating to session #' + data.sessionId);
//                $location.path(['/sessions', data.sessionId].join('/'));
            });

            var $: any = jQuery;
            var quizSession = $.connection.quizSessionHub;

            quizSession.client.onQuestionChanged = (questionId) => {
                $log.debug('question.changed', questionId);
                $scope.$broadcast('question.changed', { questionId: questionId });
            }

            quizSession.client.onQuestionSummaryChanged = (summary) => {
                $log.debug('questionSummary.changed', summary);
                $scope.$broadcast('questionSummary.changed', summary);
            }

            quizSession.client.onUserConnected = (userId) => {
                $log.debug('user.connected', userId);
                $scope.$broadcast('user.connected', { id: userId });
            }

            quizSession.client.onUserDisconnected = (userId) => {
                $log.debug('user.disconnected', userId);
                $scope.$broadcast('user.disconnected', { id: userId });
            }

            $.connection.hub.start().done(() => {
                $log.debug('Connected to real-time updates');
            });
        }]);

}