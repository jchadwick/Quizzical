/// <reference path="model.ts" />

module Quizzical.App {

    function routing($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise("/sessions");

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
                $location.path(['/sessions', data.sessionId].join('/'));
            });

/*
            rebroadcast('question.changed');
            rebroadcast('user.connected');
            rebroadcast('user.disconnected');

            function rebroadcast(name) {
                socket.on(name, data => {
                    $log.debug('[SERVER] ', name, data);
                    angular.element('body').scope().$broadcast(name, data);
                });
            }
*/
        }]);

}