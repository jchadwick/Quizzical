/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../typings/jasmine/jasmine-matchers.d.ts" />
/// <reference path="../../testing/matchers.d.ts" />

module Quizzical {
    'use strict';

    describe('QuizSessionController', () => {

        var controller: QuizSessionController,
            quizService: IQuizService,
            sessionService: IQuizSessionService,
            $scope: QuizSessionViewModel,
            createController: (scope?) => void,
            $q: ng.IQService;

        module('Quizzical.UI');

        beforeEach(inject(($rootScope: ng.IRootScopeService, $controller: ng.IControllerService, _$q_: ng.IQService) => {
            $q = _$q_;
            $scope = <any>$rootScope.$new();
            quizService = jasmine.createSpyObj('quizService', ['getById']);
            sessionService = jasmine.createSpyObj('quizSessionService', ['getById']);
            
            (<jasmine.Spy>quizService.getById).and.callFake(() => $q.when(<Quiz>{id: 1, name: 'Test Quiz'}));

            createController = (scope) => {
                controller = $controller('QuizSessionController', {
                    $scope: $scope = angular.extend($scope, scope),
                    QuizService: quizService,
                    QuizSessionService: sessionService,
                });

                $scope.$apply();
            };
        }));


        it('should load the controller', () => {
            createController();
            expect(controller).toBeDefined();
        });

        it('should load the controller', () => {
            createController();
            expect(controller).toBeDefined();
        });

        it('should retrieve quizId from session when not provided', () => {
            var expectedQuizId = 123,
                expectedSessionId = 456;

            (<jasmine.Spy>sessionService.getById).and.callFake(() =>
                $q.when(<QuizSession>{ id: expectedSessionId, quizId: expectedQuizId }));

            createController({ sessionId: expectedSessionId });

            expect($scope.quizId).toBe(expectedQuizId);
        });

        it('should update the current questionId on "question.changed" event', () => {
            var newQuestionId: number = 50;

            expect($scope.questionId).not.toBe(newQuestionId);

            createController({ quizId: 123, sessionId: 456 });

            $scope.$emit('question.changed', { questionId: newQuestionId });
            $scope.$apply();

            expect($scope.questionId).toBe(newQuestionId);
        });

    });

}