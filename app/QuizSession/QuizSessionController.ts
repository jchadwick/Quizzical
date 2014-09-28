/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Quizzical {
    'use strict';

    interface QuizSessionViewModel extends ng.IScope {
        session: QuizSession;
        quiz: Quiz;
        currentQuestion: QuestionViewModel;
        currentQuestionIndex: number;

        quizName: string;
        totalQuestions: number;

        selectAnswer(option: QuestionOptionViewModel): void;
    }

    interface QuestionOptionViewModel extends QuestionOption {
        selected: boolean;
    }

    class QuestionViewModel {
        id: number;
        description: string;
        extendedDescription: string;
        questionType: QuestionType;
        options: QuestionOptionViewModel[];
        selectedOptionId: number;

        answerSubmitted: boolean;

        constructor(question: Question) {
            this.id = question.id;
            this.description = question.description;
            this.extendedDescription = question.extendedDescription;
            this.options = <QuestionOptionViewModel[]>question.options;
        }

        hasExtendedDescription(): boolean {
            return !!this.extendedDescription;
        }

        hasOptions(): boolean {
            return this.options && this.options.length > 0;
        }

        answerIsBeingSubmitted(): boolean {
            return this.selectedOptionId && !this.answerSubmitted;
        }

        selectAnswer(option: QuestionOptionViewModel) {

            if (!option) {
                this.selectedOptionId = null;
                return;
            }

            for (var i = 0; i < this.options.length; i++) {
                this.options[i].selected = false;
            }

            option.selected = true;
            this.selectedOptionId = option.id;

            console.log('Selected answer ', option);
        }
    }

    class QuizSessionController {

        static $inject = [ '$scope', 'QuizService', 'QuestionService', 'AnswerService' ];

        constructor(
            private $scope: QuizSessionViewModel,
            private quizService: IQuizService,
            private questionService: IQuestionService,
            private answerService: IAnswerService) {


            $scope.selectAnswer = (option) => {
                $scope.currentQuestion.selectAnswer(option);
            }


            $scope.$watch('session', () => {
                if (!$scope.session)
                    return;

                quizService.getById($scope.session.quizId).then((quiz: Quiz) => {
                    $scope.quiz = quiz;
                    $scope.quizName = quiz ? quiz.name : '';
                    $scope.totalQuestions = (quiz && quiz.questions) ? quiz.questions.length : 0;
                });
            });

            $scope.$watch('session.currentQuestionId', () => {
                var session = $scope.session;

                if (!session || !session.currentQuestionId)
                    return;

                console.log('Loading question #', session.currentQuestionId);

                questionService.getById(session.quizId, session.currentQuestionId).then((question: Question) => {
                    console.log('Loaded question', question);
                    $scope.currentQuestion = new QuestionViewModel(question);
                });
            });

            $scope.$watch('currentQuestion.selectedOptionId', () => {
                var question = $scope.currentQuestion,
                    session = $scope.session;

                if (!question || !question.selectedOptionId)
                    return;

                question.answerSubmitted = false;

                answerService.submit(<Answer>{
                    questionId: session.currentQuestionId,
                    questionOptionId: question.selectedOptionId,
                    quizId: session.quizId,
                    sessionId: session.id,
                }).then(() => {
                    question.answerSubmitted = true;
                });
            });
        }
    }

    angular.module('Quizzical.UI').controller('QuizSessionController', QuizSessionController);
}