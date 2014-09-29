/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />

module Quizzical {
    'use strict';

    export interface IQuizSessionService {
        create(quizId: number): ng.IPromise<QuizSession>;
        getById(sessionId: number): ng.IPromise<QuizSession>;
        join(sessionId: number): ng.IPromise<QuizSession>;
        list(): ng.IPromise<QuizSession[]>;
    }


    QuizSessionService.$inject = ['$resource'];

    function QuizSessionService($resource: ng.resource.IResourceService) {

        var QuizSessionData =
            $resource<ng.resource.IResource<QuizSession>>('/api/sessions/:sessionId', { 'sessionId': '@sessionId' }, {
                'available': { method: 'GET', url: '/api/sessions/available', isArray: true },
                'join': { method: 'POST', url: '/api/sessions/:sessionId/join' },
            });


        return <IQuizSessionService> {

            create: (quizId: number): ng.IPromise<QuizSession> => {
                var session = { quizId: quizId, connectedUserIds: [], currentQuestionId: null };
                return (<any>QuizSessionData.save(session)).$promise;
            },

            getById(sessionId: number): ng.IPromise<QuizSession> {
                if (!angular.isDefined(sessionId)) throw 'Invalid Session Id';

                return new QuizSessionData({sessionId: sessionId}).$get();
            },

            join: (sessionId: number): ng.IPromise<QuizSession> => {
                if (!angular.isDefined(sessionId)) throw 'Invalid Session Id';

                return (<any>QuizSessionData).join({ sessionId: sessionId }).$promise;
            },

            list: (): ng.IPromise<QuizSession[]> => {
                return (<any>QuizSessionData).available().$promise;
            }

        }
    }



    angular.module('Quizzical.Services')
        .service('QuizSessionService', QuizSessionService);

}