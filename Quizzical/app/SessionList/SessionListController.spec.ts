/// <reference path="../model.ts" />
/// <reference path="../mockData.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../typings/jasmine/jasmine-matchers.d.ts" />
/// <reference path="../../testing/matchers.d.ts" />
/// <reference path="SessionListController.ts" />

module Quizzical {
    'use strict';

    describe('SessionListController', () => {

        var controller: SessionListController,
            $rootScope,
            $scope: SessionListViewModel,
            sessionService: IQuizSessionService,
            $q: ng.IQService,
            session: QuizSession = <any>{ id: 1},
            sessions = [session];

        beforeEach(inject((_$rootScope_, $controller: ng.IControllerService, _$q_) => {
            $q = _$q_;
            $rootScope = _$rootScope_;

            $scope = <any>_$rootScope_.$new();

            sessionService = <IQuizSessionService>{
                list: (): ng.IPromise<QuizSession[]> => {
                    return $q.when(sessions);
                },
                join: (): ng.IPromise<QuizSession> => {
                    return $q.when(session);
                },
                getById: (id: number): ng.IPromise<QuizSession> => {
                    return $q.when(session);
                },
                create: (id: number): ng.IPromise<QuizSession> => {
                    return $q.when(session);
                }
            };

            spyOn(sessionService, 'create').and.callThrough();
            spyOn(sessionService, 'getById').and.callThrough();
            spyOn(sessionService, 'list').and.callThrough();
            spyOn(sessionService, 'join').and.callThrough();

            controller = $controller('SessionListController', { $scope: $scope, QuizSessionService: sessionService });
            $rootScope.$apply();
        }));

        it('should auto-load sessions', () => {
            expect(sessionService.list).toHaveBeenCalled();
            expect($scope.sessions).toBe(sessions);
        });

        it('should refresh sessions', () => {
            var expected = [];
            sessionService.list = () => $q.when(expected);
            spyOn(sessionService, 'list').and.callThrough();

            $scope.refresh();
            $rootScope.$apply();

            expect(sessionService.list).toHaveBeenCalled();
            expect($scope.sessions).toBe(expected);
        });

        it('should join valid session', () => {

            expect($scope.session).toBeUndefined();

            $scope.join(session);
            $rootScope.$apply();

            expect(sessionService.join).toHaveBeenCalled();
            expect($scope.session).toBe(session);
        });

        it('should NOT join INVALID session', () => {

            expect($scope.session).toBeUndefined();

            $scope.join(null);
            $rootScope.$apply();

            expect(sessionService.join).not.toHaveBeenCalled();
            expect($scope.session).toBeUndefined();
        });

    });
}