/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Quizzical {
    'use strict';

    export interface QuestionOptionViewModel extends QuestionOption {
        selected: boolean;

        count?: number;
        percentage?: number;
    }

    export interface QuestionViewModel extends Question, ng.IScope {
        questionId: number;
        quizId: number;
        sessionId: number;

        options: QuestionOptionViewModel[];
        selectedOption: QuestionOptionViewModel;
        answerSubmitted: boolean;
        answers?: AnswerSummary[];

        answerIsBeingSubmitted(): boolean;
        canSelectAnswer(): boolean;
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

            $scope.canSelectAnswer = (): boolean => {
                return !$scope.answerSubmitted;
            };

            $scope.hasExtendedDescription = (): boolean => {
                return !!$scope.extendedDescription;
            }

            $scope.hasOptions = (): boolean => {
                return $scope.options && $scope.options.length > 0;
            }

            $scope.answerIsBeingSubmitted = (): boolean => {
                return $scope.selectedOption && !$scope.answerSubmitted;
            }

            $scope.selectAnswer = (option: QuestionOptionViewModel) => {
                if (!option || !option.id) {
                    $scope.selectedOption = null;
                    return;
                }

                for (var i = 0; i < $scope.options.length; i++) {
                    $scope.options[i].selected = false;
                }

                option.selected = true;
                $scope.selectedOption = option;
                $scope.answerSubmitted = false;

                $log.debug('Submitting answer: ', option.description, '...');

                answerService.submit(<Answer>{
                    questionId: $scope.questionId,
                    questionOptionId: option.id,
                    sessionId: $scope.sessionId,
                }).then(() => {
                        $scope.answerSubmitted = true;
                        $log.info('Submitted answer: ', option.description);
                        loadAnswerSummary();
                    }, (ex) => {
                        $log.warn('Failed to submit answer!  ', ex);
                        option.selected = false;
                        $scope.selectedOption = null;
                        $scope.answerSubmitted = false;
                    });
            };


            function loadQuestion() {
                if (!$scope.questionId) return;

                $log.debug('[QuestionController] Loading question ' + $scope.questionId + '...');
                questionService.getById($scope.quizId, $scope.questionId).then((question: Question) => {
                    $scope.selectedOption = null;
                    $scope.answerSubmitted = false;
                    angular.extend($scope, question);
                    $log.debug('[QuestionController] Loaded question ' + $scope.questionId);
                });
            }

            function updateSummary(summary: AnswersSummary) {

                if (!summary || !summary.answers) return;

                angular.extend($scope, summary);

                $scope.options.forEach((option) => {
                    option.count = option.percentage = 0;

                    summary.answers.forEach((answerSummary: AnswerSummary) => {
                        if (answerSummary.questionOptionId != option.id)
                            return;

                        option.count = answerSummary.count;
                        option.percentage = answerSummary.percentage;
                    });
                });
            }

            function loadAnswerSummary() {
                answerService.getSummary($scope.questionId, $scope.sessionId)
                    .then(updateSummary);
            }

            $scope.$on('questionSummary.changed', (evt, summary: AnswersSummary) => {
                if (summary && summary.sessionId == $scope.sessionId && summary.questionId == $scope.questionId) {
                    updateSummary(summary);
                    if (!$scope.$$phase) $scope.$apply();
                }
            });

            $scope.$watch('questionId', loadQuestion);
        }
    }

    angular.module('Quizzical.UI').controller('QuestionController', QuestionController);
}