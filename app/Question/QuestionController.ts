/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Quizzical {
    'use strict';

    export interface QuestionOptionViewModel extends QuestionOption {
        selected: boolean;
    }

    export interface QuestionViewModel extends Question, ng.IScope {
        questionId: number;
        quizId: number;
        sessionId: number;

        options: QuestionOptionViewModel[];
        selectedOptionId: number;
        answerSubmitted: boolean;

        answerIsBeingSubmitted(): boolean;
        hasExtendedDescription(): boolean;
        hasOptions(): boolean;
        selectAnswer(option: QuestionOptionViewModel): void;
    }

    export class QuestionController {

        static $inject = ['$log', '$scope', 'QuizSessionService', 'QuestionService', 'AnswerService'];

        constructor(
            private $log: ng.ILogService,
            private $scope: QuestionViewModel,
            private sessionService: IQuizSessionService,
            private questionService: IQuestionService,
            private answerService: IAnswerService) {

            $log.debug('[QuestionController] Init');

            $scope.hasExtendedDescription = (): boolean => {
                return !!$scope.extendedDescription;
            }

            $scope.hasOptions = (): boolean => {
                return $scope.options && $scope.options.length > 0;
            }

            $scope.answerIsBeingSubmitted = (): boolean => {
                return $scope.selectedOptionId && !$scope.answerSubmitted;
            }

            $scope.selectAnswer = (option: QuestionOptionViewModel) => {
                if (!option) {
                    $scope.selectedOptionId = null;
                    return;
                }

                for (var i = 0; i < $scope.options.length; i++) {
                    $scope.options[i].selected = false;
                }

                option.selected = true;
                $scope.selectedOptionId = option.id;
                $log.debug('Selected answer: ', option.description);
            }


            $scope.$watch('selectedOptionId', () => {

                if (!$scope.selectedOptionId)
                    return;

                $scope.answerSubmitted = false;

                answerService.submit(<Answer>{
                    questionId: $scope.questionId,
                    questionOptionId: $scope.selectedOptionId,
                    sessionId: $scope.sessionId,
                }).then(() => {
                    $scope.answerSubmitted = true;
                });
            });


            function loadQuestion() {
                if (!$scope.questionId) return;

                $log.debug('[QuestionController] Loading question '+$scope.questionId+'...');
                questionService.getById($scope.quizId, $scope.questionId).then((question: Question) => {
                    $scope.description = question.description;
                    $scope.extendedDescription = question.extendedDescription;
                    $scope.options = <any>question.options;
                    $log.debug('[QuestionController] Loaded question ' + $scope.questionId);
                });
            }

            $scope.$watch('questionId', loadQuestion);
        }
    }

    angular.module('Quizzical.UI').controller('QuestionController', QuestionController);
}