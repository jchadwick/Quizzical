/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../typings/jasmine/jasmine-matchers.d.ts" />
/// <reference path="../../testing/matchers.d.ts" />

module Quizzical {
    'use strict';

    describe('QuestionController', () => {

        var controller: QuestionController,
            sessionService: IQuestionService,
            questionService: IQuestionService,
            answerService: IAnswerService,
            $scope: QuestionViewModel,
            createController: (scope?) => void,
            $q: ng.IQService;

        module('Quizzical.UI');

        beforeEach(inject(($rootScope: ng.IRootScopeService, $controller: ng.IControllerService, _$q_: ng.IQService) => {
            $q = _$q_;
            $scope = <any>$rootScope.$new();

            answerService = <any>jasmine.createSpyObj('answerService', ['submit']);
            questionService = <any>jasmine.createSpyObj('questionService', ['getById']);
            sessionService = <any>jasmine.createSpyObj('sessionService', ['getById']);
            
            createController = (scope) => {
                controller = $controller('QuestionController', {
                    $scope: $scope = angular.extend($scope, scope|| {}),
                    AnswerService: answerService,
                    QuestionService: questionService,
                    QuizSessionService: sessionService,
                });

                $scope.$apply();
            };
        }));


        it('should load the controller', () => {
            createController();
            expect(controller).toBeDefined();
        });


        it('should load the question when the questionId is changed', () => {
            createController();
            expect($scope.questionId).toBeUndefined();
            expect($scope.description).toBeUndefined();

            var expectedDescription = 'Test';

            (<jasmine.Spy>questionService.getById).and.callFake(() =>
                $q.when({ description: expectedDescription }));

            $scope.questionId = 123;
            $scope.$apply();

            expect($scope.description).toBe(expectedDescription);
        });


        it('should NOT allow submission of an invalid answer', () => {

            var question = { id: 123, options: [{}] };

            (<jasmine.Spy>questionService.getById).and.callFake(() => $q.when(question));

            createController({ questionId: question.id, sessionId: 456 });

            $scope.selectAnswer(<any>{ id: 0 });
            $scope.$apply();

            expect(answerService.submit).not.toHaveBeenCalled();


            $scope.selectAnswer(null);
            $scope.$apply();

            expect(answerService.submit).not.toHaveBeenCalled();
        });

        it('should submit the answer when an option is selected', () => {
            var option: QuestionOptionViewModel = { id: 1, description: 'Twerk', selected: true },
                question = { id: 123, options: [option]};

            (<jasmine.Spy>questionService.getById).and.callFake(() => $q.when(question));
            (<jasmine.Spy>answerService.submit).and.callFake(() => $q.when());

            createController({ questionId: question.id, sessionId: 456 });

            $scope.selectAnswer(option);
            $scope.$apply();

            var answer = (<jasmine.Spy>answerService.submit).calls.mostRecent().args[0];
            expect(answer).toBeDefined();
            expect(answer.questionId).toBe($scope.questionId);
            expect(answer.sessionId).toBe($scope.sessionId);
            expect(answer.questionOptionId).toBe(option.id);
        });

        it('should be able to submit an answer when no answer has been submitted', () => {
            (<jasmine.Spy>questionService.getById).and.callFake(() => $q.when({ id: 123, options: [] }));
            createController({ questionId: 123, sessionId: 456 });

            expect($scope.canSelectAnswer()).toBeTruthy();
        });

        it('should not be able to submit another answer after the first one has been submitted', () => {
            var option: QuestionOptionViewModel = { id: 1, description: 'Twerk', selected: true },
                question = { id: 123, options: [option]};

            (<jasmine.Spy>questionService.getById).and.callFake(() => $q.when(question));
            (<jasmine.Spy>answerService.submit).and.callFake(() => $q.when());

            createController({ questionId: question.id, sessionId: 456 });

            $scope.selectAnswer(option);
            $scope.$apply();

            expect($scope.canSelectAnswer()).toBeFalsy();
        });


        it('answerIsBeingSubmitted should reflect whether the selected answer is on its way to the server (but not yet registered)', () => {
            createController();

            $scope.selectedOption = null;
            $scope.answerSubmitted = false;
            expect($scope.answerIsBeingSubmitted()).toBeFalsy();

            $scope.selectedOption = null;
            $scope.answerSubmitted = true;
            expect($scope.answerIsBeingSubmitted()).toBeFalsy();

            $scope.selectedOption = <any>{};
            $scope.answerSubmitted = false;
            expect($scope.answerIsBeingSubmitted()).toBeTruthy();
        });

        it('hasExtendedDescription should represent the existence of the extended description', () => {
            createController();

            $scope.extendedDescription = null;
            expect($scope.hasExtendedDescription()).toBeFalsy();

            $scope.extendedDescription = 'extended description';
            expect($scope.hasExtendedDescription()).toBeTruthy();
        });

        it('hasOptions should reflect whether or not there are options to choose from', () => {
            createController();

            $scope.options = null;
            expect($scope.hasOptions()).toBeFalsy();
            $scope.options = [];
            expect($scope.hasOptions()).toBeFalsy();

            $scope.options = [<any>{}];
            expect($scope.hasOptions()).toBeTruthy();
        });

    });

}