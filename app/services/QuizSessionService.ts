/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />

module Quizzical {
    'use strict';

    export interface IQuizSessionService {
        create(quizId: number): ng.IPromise<QuizSession>;
        join(quizId: number, sessionId: number): ng.IPromise<QuizSession>;
        list(): ng.IPromise<QuizSession[]>;
    }


    QuizSessionService.$inject = ['$resource'];

    function QuizSessionService($resource: ng.resource.IResourceService) {

        var QuizSessionData =
            $resource<QuizSession>('/api/quizzes/:quizId/sessions/:sessionId', { 'quizId': '@quizId', 'sessionId': '@sessionId' }, {
                'available': { method: 'GET', url: '/api/quizzes/sessions/available', isArray: true },
                'join': { method: 'POST', url: '/api/quizzes/:quizId/sessions/:sessionId/join' },
            });


        return <IQuizSessionService> {

            create: (quizId: number): ng.IPromise<QuizSession> => {
                var session = { id: 1, quizId: quizId, connectedUserIds: [], currentQuestionId: 1 };
                return (<any>QuizSessionData.save(session)).$promise;
            },

            join: (quizId: number, sessionId: number): ng.IPromise<QuizSession> => {
                if (!angular.isDefined(quizId)) throw 'Invalid Quiz Id';
                if (!angular.isDefined(sessionId)) throw 'Invalid Session Id';

                return (<any>QuizSessionData).join({ quizId: quizId, sessionId: sessionId }).$promise;
            },

            list: (): ng.IPromise<QuizSession[]> => {
                return (<any>QuizSessionData).available().$promise;
            }

        }
    }



    angular.module('Quizzical.Services')
        .service('QuizSessionService', QuizSessionService);

}