/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Quizzical {
    'use strict';


    angular.module('Quizzical.UI').directive('qzQuestion', (): ng.IDirective => {
        
        return <ng.IDirective>{
            scope: {
                questionId: '=',
                quizId: '=',
                sessionId: '=',
            },
            controller: Quizzical.QuestionController,
            templateUrl: '/app/Question/Question.tmpl.html'
        }
    });
}