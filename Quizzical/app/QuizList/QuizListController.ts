/// <reference path="../model.ts" />
/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />

module Quizzical {

    interface QuizListViewModel {
        selectedQuiz: Quiz;
        quizzes: Quiz[];

        selectQuiz(quiz: Quiz): void;
    }

    class QuizListController {

        static $inject = ['scope'];

        constructor(viewModel: QuizListViewModel) {

            viewModel.selectQuiz = (quiz: Quiz) => {
                viewModel.selectedQuiz = quiz;
            }

        }

    }

    angular.module('Quizzical').controller('QuizListController', QuizListController);
}