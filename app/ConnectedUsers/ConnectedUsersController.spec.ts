/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../typings/jasmine/jasmine-matchers.d.ts" />
/// <reference path="../../testing/matchers.d.ts" />

module Quizzical {
    'use strict';

    describe('ConnectedUsersController', () => {

        var controller: ConnectedUsersController,
            $scope: ConnectedUsersViewModel;

        module('Quizzical.UI');

        beforeEach(inject(($rootScope: ng.IRootScopeService, $controller: ng.IControllerService) => {
            $scope = <any>$rootScope.$new();
            
            controller = $controller('ConnectedUsersController', { $scope: $scope });
            $scope.$apply();
        }));


        it('should load the controller', () => {
            expect(controller).toBeDefined();
        });

        it('should find connected user by id', () => {
            var connectedUserId = '123';

            $scope.connectedUsers.push({ id: connectedUserId, name: 'testuser' });

            var user = $scope.findUser(connectedUserId);
            expect(user).not.toBeNull();
            expect(user.id).toBe(connectedUserId);
        });

        it('should add user to connected users list when "user.connected" event occurs', () => {
            var connectedUserId = '123';

            expect($scope.findUser(connectedUserId)).toBeNull();

            $scope.$emit('user.connected', { id: connectedUserId });

            var addedUser = $scope.findUser(connectedUserId);
            expect(addedUser).not.toBeNull();
            expect(addedUser.id).toBe(connectedUserId);
        });

        it('should not add the same user (id) twice', () => {
            var connectedUserId = '123';

            function userMatchesConnectedUserId(user: User) {
                return user.id == connectedUserId;
            }

            $scope.connectedUsers.push({ id: connectedUserId, name: 'testuser' });
            expect($scope.connectedUsers.filter(userMatchesConnectedUserId).length).toBe(1);

            $scope.addUser(connectedUserId);

            expect($scope.connectedUsers.filter(userMatchesConnectedUserId).length).toBe(1);
        });

        it('should remove user to connected users list when "user.disconnected" event occurs', () => {
            var connectedUserId = '123';

            $scope.addUser(connectedUserId);
            expect($scope.findUser(connectedUserId)).not.toBeNull();

            $scope.$emit('user.disconnected', { id: connectedUserId });

            expect($scope.findUser(connectedUserId)).toBeNull();
        });

    });

}