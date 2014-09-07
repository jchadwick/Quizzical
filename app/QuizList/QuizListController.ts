/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Quizzical {
    'use strict';

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