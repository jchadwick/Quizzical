/// <reference path="../model.ts" />
/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />

module Quizzical {

    interface QuizSessionViewModel {
        quiz: Quiz;
        currentQuestion: QuizSessionQuestionViewModel;

        totalQuestions(): number;
    }

    interface QuizSessionQuestionViewModel {
        question: string;
        extendedDescription: string;
        options: QuestionOption;
        answer: Answer;

        hasExtendedDescription(): boolean;
        hasOptions(): boolean;
        hasAnswer(): boolean;
    }

    class QuizSessionController {

        static $inject = ['scope'];

        constructor(viewModel: QuizSessionViewModel) {

        }

    }

    angular.module('Quizzical').controller('QuizSessionController', QuizSessionController);
}