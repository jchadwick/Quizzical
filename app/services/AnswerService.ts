/// <reference path="../model.ts" />

module Quizzical {
    'use strict';

    export interface IAnswerService {
        submitAnswer(answer: Answer): void;
    }

    class AnswerService {
        
    }

    angular.module('Quizzical.Services')
        .service('AnswerService', AnswerService);
}