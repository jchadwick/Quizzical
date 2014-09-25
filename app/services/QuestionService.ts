/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />

module Quizzical {
    'use strict';

    export interface IQuestionService {
        getAll(quizId: number): ng.IPromise<Question[]>;
        getById(quizId: number, questionId: number): ng.IPromise<Question>;
        save(quizId: number, question: Quizzical.Question): ng.IPromise<Question>;
        delete(quizId: number, questionId: number): ng.IPromise<void>
    }


    QuestionService.$inject = ['$resource'];
    function QuestionService ($resource: ng.resource.IResourceService) {

        var QuestionData =
            $resource<ng.resource.IResource<Question>>('/api/quizzes/:quizId/questions/:questionId',
                { 'quizId': '@quizId', 'questionId': '@questionId' },
                {
                    'update': { method: 'POST', params: { 'quizId': '@quizId', 'questionId': '@id' } }
                }
            );

        return <IQuestionService> {

            'delete': (quizId: number, questionId: number): ng.IPromise<any> => {
                return new QuestionData({ quizId: quizId, questionId: questionId }).$delete();
            },

            getAll: (quizId: number): ng.IPromise<Question[]> => {
                return (<any>QuestionData.query({ quizId: quizId })).$promise;
            },

            getById: (quizId: number, questionId: number): ng.IPromise<Question> => {
                return new QuestionData({ quizId: quizId, questionId: questionId }).$get();
            },

            save: (quizId: number, question: Quizzical.Question): ng.IPromise<Question> => {
                if (question.id == 0) {
                    return new QuestionData(angular.extend({ quizId: quizId }, question)).$save();
                }

                return (<any>QuestionData).update(angular.extend({ quizId: quizId }, question)).$promise;
            }
        }
    }


    angular.module('Quizzical.Services')
        .service('QuestionService', QuestionService);
}