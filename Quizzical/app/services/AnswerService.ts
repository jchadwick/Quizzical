/// <reference path="../model.ts" />

module Quizzical {

    export interface IAnswerService {
        submitAnswer(answer: Answer): void;
    }

    class AnswerService {
        
    }

    angular.module('Quizzical.Services')
        .service('AnswerService', AnswerService);
}