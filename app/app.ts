module Quizzical.App {

    angular.module('Quizzical.UI').run(['$log', '$rootScope', '$controller',
        ($log, $scope: SessionListViewModel, $controller: ng.IControllerService) => {

            $log.info('Initializing application...');

            $scope.$watch('sessions', () => {
                if ($scope.sessions) {
                    // Auto-join the first session (until session-picking is in place)
                    $scope.join($scope.sessions[0]);
                }
            });

            $controller(Quizzical.SessionListController, { $scope: $scope });
        }]);

}