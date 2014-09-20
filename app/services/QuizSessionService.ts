/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />

module Quizzical {
    'use strict';

    export interface IQuizSessionService {
        create(quizId: number): ng.IPromise<QuizSession>;
        join(id: number): ng.IPromise<QuizSession>;
        list(): ng.IPromise<QuizSession[]>;
    }


    class QuizSessionService {

        static $inject = ['QuizSessionData', '$q'];

        constructor(
            private QuizSessionData: ng.resource.IResourceClass<QuizSession>, 
            private $q: ng.IQService) {
        }

        create(quizId: number): ng.IPromise<QuizSession> {
            var session = {id: 1, quizId: quizId, connectedUserIds: [], currentQuestionId: 1};
            return (<any>this.QuizSessionData.save(session)).$promise;
        }

        join(quizId: number, sessionId: number): ng.IPromise<QuizSession> {
            if (!angular.isDefined(quizId)) throw 'Invalid Quiz Id';
            if (!angular.isDefined(sessionId)) throw 'Invalid Session Id';

            return (<any>this.QuizSessionData).join({ quizId: quizId, sessionId: sessionId }).$promise;
        }

        list(quizId?: number): ng.IPromise<QuizSession[]> {
            var query =
                angular.isDefined(quizId)
                ? this.QuizSessionData.query({ quizId: quizId })
                : (<any>this.QuizSessionData).available();

            return query.$promise;
        }
    }


    angular.module('Quizzical.Services')
        .factory('QuizSessionData', ['$resource', ($resource: ng.resource.IResourceService) => {
            return $resource<QuizSession>('/api/quizzes/:quizId/sessions/:sessionId', { 'quizId': '@quizId', 'sessionId':'@sessionId'}, {
                'available': { method: 'GET', url: '/api/quizzes/sessions/available', isArray: true },
                'join': { method: 'POST', url: '/api/quizzes/:quizId/sessions/:sessionId/join' },
            });
        }]);

    angular.module('Quizzical.Services')
        .service('QuizSessionService', QuizSessionService);

}