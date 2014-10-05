/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Quizzical {
    'use strict';

    export interface ConnectedUserViewModel extends User {
    }

    export interface ConnectedUsersViewModel extends ng.IScope {
        connectedUsers: ConnectedUserViewModel[];

        addUser(userId: string): void;
        findUser(userId: string): ConnectedUserViewModel;
        removeUser(userId: string): void;
    }

    export class ConnectedUsersController {

        static $inject = ['$log', '$scope' ];

        constructor(
            private $log: ng.ILogService,
            private $scope: ConnectedUsersViewModel) {

            $scope.connectedUsers = [];
            $scope.addUser = addUser;
            $scope.findUser = findUser;
            $scope.removeUser = removeUser;

            $scope.$on('user.connected', (args, data) => {
                $scope.addUser(data.id);
                if (!$scope.$$phase) $scope.$apply();
            });

            $scope.$on('user.disconnected', (args, data) => {
                $scope.removeUser(data.id);
                if (!$scope.$$phase) $scope.$apply();
            });



            function addUser(userId: string) {
                var user = findUser(userId);

                $log.debug('Already-connected user: ',user);

                if (user) return;
                $log.debug('Adding connected user ' + userId + '...');

                var username = userId;  // TODO: Fetch username
                $scope.connectedUsers.push(<ConnectedUserViewModel>{ id: userId, name: username });
            }

            function findUser(userId: string): ConnectedUserViewModel {
                var users = $scope.connectedUsers.filter(u => u.id == userId);
                return users.length ? users[0] : null;
            }

            function removeUser(userId: string) {
                var user = findUser(userId),
                    index = $scope.connectedUsers.indexOf(user);

                if (index >= 0) {
                    $scope.connectedUsers.splice(index, 1);
                }
            }
        }
    }

    angular.module('Quizzical.UI').controller('ConnectedUsersController', ConnectedUsersController);
}