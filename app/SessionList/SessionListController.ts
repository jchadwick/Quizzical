/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Quizzical {

    export interface SessionListViewModel extends ng.IScope {
        session: QuizSession;
        sessions: QuizSession[];

        join(session: QuizSession): void;
        refresh: () => void;
    }

    export class SessionListController {

        static $inject = ['$log', '$scope', 'QuizSessionService'];

        constructor(
            private $log: ng.ILogService,
            private $scope: SessionListViewModel,
            private sessionService: IQuizSessionService) {

            function refreshSessions() {
                $log.debug('Retrieving session list...');
                sessionService.list().then((sessions: QuizSession[]) => {
                    $log.debug('Retrieved ', (sessions && sessions.length), ' sessions');
                    $scope.sessions = sessions;
                });
            }

            $scope.join = (session: QuizSession) => {

                if (!session || !session.id) {
                    $log.warn('Refusing to join invalid session');
                    return;
                }

                $log.debug('Joining session #' + session.id +'...');

                sessionService.join(session.id).then((joined) => {
                    $scope.session = joined;
                    $log.info('Joined session #' + session.id);
                    $scope.$emit('session.joined', { quizId: joined.quizId, sessionId: joined.id });
                });
            }

            $scope.refresh = refreshSessions;

            // Load the list automatically
            refreshSessions();
        }

    }

    angular.module('Quizzical.UI')
        .controller('SessionListController', SessionListController);
}