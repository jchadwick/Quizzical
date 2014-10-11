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


    QuizSessionService.$inject = ['$resource', '$q'];

    function QuizSessionService($resource: ng.resource.IResourceService, $q: ng.IQService) {

        var QuizSessionData =
            $resource<ng.resource.IResource<QuizSession>>('/api/sessions/:sessionId', { 'sessionId': '@sessionId' }, {
                'available': { method: 'GET', url: '/api/sessions/available', isArray: true },
                'join': { method: 'POST', url: '/api/sessions/:sessionId/join' },
            });


        return <IQuizSessionService> {

            create: (quizId: number): ng.IPromise<QuizSession> => {
                if (!quizId)
                    throw 'Invalid Quiz Id';

                var session = { quizId: quizId, connectedUserIds: [], currentQuestionId: null };
                return (<any>QuizSessionData.save(session)).$promise;
            },

            getById(sessionId: number): ng.IPromise<QuizSession> {
                if (!sessionId)
                    throw 'Invalid Session Id';

                return new QuizSessionData({ sessionId: sessionId }).$get();
            },

            join: (sessionId: number): ng.IPromise<QuizSession> => {
                if (!sessionId)
                    throw 'Invalid Session Id';

                var $: any = jQuery;
                var deferred = $q.defer<QuizSession>();

                $.connection.quizSessionHub.server.joinSession(sessionId)
                    .then(() => {
                        new QuizSessionData({ sessionId: sessionId }).$get()
                            .then((session) => { deferred.resolve(session); });
                    });

                return deferred.promise;
            },

            list: (): ng.IPromise<QuizSession[]> => {
                return (<any>QuizSessionData).available().$promise;
            }

        }
    }



    angular.module('Quizzical.Services')
        .service('QuizSessionService', QuizSessionService);

}