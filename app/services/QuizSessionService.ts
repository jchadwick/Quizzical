/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />

module Quizzical {
    'use strict';

    export interface IQuizSessionService {
        //create(quizId: number): ng.IPromise<QuizSession>;
        join(id: number): ng.IPromise<QuizSession>;
        list(): ng.IPromise<QuizSession[]>;
    }


    class QuizSessionService {

        static $inject = ['QuizSessionData'];

        constructor(private QuizSessionData: ng.resource.IResourceClass<QuizSession>) {
        }

        list(): ng.IPromise<QuizSession[]> {
            return this.QuizSessionData.query().$promise;
        }
    }


    angular.module('Quizzical.Services')
        .factory('QuizSessionData', ['$resource', ($resource: ng.resource.IResourceService) => {
            return $resource<QuizSession>('/api/quizSessions');
        }]);

    angular.module('Quizzical.Services')
        .service('QuizSessionService', QuizSessionService);

}