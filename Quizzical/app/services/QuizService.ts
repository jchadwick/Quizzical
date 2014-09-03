/// <reference path="../model.ts" />

module Quizzical {

    export interface IQuizService {
        list(): Quiz[];
        save(quiz: Quiz): Quiz;
    }

    class QuizSessionService {

    }

    angular.module('Quizzical.Services')
        .service('QuizSessionService', QuizSessionService);

}