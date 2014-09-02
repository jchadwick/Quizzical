/// <reference path="../model.ts" />

module Quizzical {

    export interface IAnswerService {
        submitAnswer(answer: Answer): void;
    }
}