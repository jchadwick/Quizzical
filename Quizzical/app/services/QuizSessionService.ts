/// <reference path="../model.ts" />

module Quizzical {

    export interface IQuizSessionService {
        list(): QuizSession[];
        create(quizId: number): QuizSession;
        join(id: number): QuizSession;
    }

    class QuizSessionService {

    }

    angular.module('Quizzical.Services')
        .service('QuizSessionService', QuizSessionService);

}