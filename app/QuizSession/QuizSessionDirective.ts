/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Quizzical {
    'use strict';

    angular.module('Quizzical.UI').directive('qzQuizSession', (): ng.IDirective => {

        return <ng.IDirective>{
            scope: false,
            controller: Quizzical.QuizSessionController,
            templateUrl: '/app/QuizSession/QuizSession.tmpl.html'
        };

    });

}