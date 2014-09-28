module Quizzical.App {

    angular.module('Quizzical.UI').run(['$log', '$rootScope', 'QuizSessionService',
        ($log, $scope, sessionService: IQuizSessionService) => {

            $log.info('Initializing session...');

            sessionService.list().then((sessions: QuizSession[]) => {

                $log.info('Found ', sessions.length, ' sessions...');

                var session: QuizSession = sessions[0];
                $log.info('Auto-joining session #', session.id);

                sessionService.join(session.quizId, session.id).then(session => {
                    $log.info('Joined session #', session.id, session);
                    $scope.session = session;
                });
            });
        }]);

}