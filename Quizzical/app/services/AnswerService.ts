/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />

module Quizzical {
    'use strict';

    export interface IAnswerService {
        getAll(questionId: number, sessionId: number): ng.IPromise<Answer[]>;
        getSummary(questionId: number, sessionId: number): ng.IPromise<AnswersSummary>;
        submit(answer: Quizzical.Answer): ng.IPromise<Answer>;
    }


    AnswerService.$inject = ['$resource'];
    function AnswerService($resource: ng.resource.IResourceService) {

        var url = '/api/sessions/:sessionId/questions/:questionId/answers/:answerId';
        var AnswerData =
            $resource<ng.resource.IResource<Answer>>(url,
                { 'sessionId': '@sessionId', 'questionId': '@questionId', 'answerId': '@answerId' },
                {
                    'submit': { method: 'POST', url: url.replace('answers', 'answer'), params: { 'quizId': '@quizId', 'sessionId': '@sessionId', 'questionId': '@questionId', 'answerId': '@id' } },
                    'summary': { method: 'GET', isArray: true, url: url + '/summary', params: { 'quizId': '@quizId', 'sessionId': '@sessionId', 'questionId': '@questionId', 'answerId': '@id' } },
                }
            );


        return <IAnswerService> {

            getAll: (questionId: number, sessionId: number): ng.IPromise<Answer[]> => {
                return (<any>AnswerData.query({ questionId: questionId, sessionId: sessionId })).$promise;
            },

            getSummary: (questionId: number, sessionId: number): ng.IPromise<AnswersSummary> => {
                var allAnswersRequest = (<any>AnswerData).summary({ questionId: questionId, sessionId: sessionId }).$promise;

                return allAnswersRequest.then(answers => {

                    // TODO:  This should all happen on the server side!
                    var optionIds = answers.map((a) => a.questionOptionId);

                    var summaries = optionIds.map((optionId: number) => {
                        var count = answers.filter((a) => a.questionOptionId == optionId).length,
                            percentage = Math.floor((count / answers.length) * 100);

                        return <AnswerSummary>{
                            questionOptionId: optionId,
                            count: count,
                            percentage: percentage,
                        };
                    });

                    return <AnswersSummary> {
                        questionId: questionId,
                        sessionId: sessionId,
                        answers: summaries,
                    };
                });
            },

            submit: (answer: Quizzical.Answer): ng.IPromise<Answer> => {
                return (<any>AnswerData).submit(answer).$promise;
            }
        }
    }


    angular.module('Quizzical.Services')
        .service('AnswerService', AnswerService);
}