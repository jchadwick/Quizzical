/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />

module Quizzical {
    'use strict';

    export interface IQuizService {
        delete(quizId: number): ng.IPromise<void>;
        getAll(): ng.IPromise<Quiz[]>;
        getById(quizId: number): ng.IPromise<Quiz>;
        save(quiz: Quiz): ng.IPromise<Quiz>;
    }


    QuizService.$inject = ['$resource'];

    function QuizService($resource: ng.resource.IResourceService) {

        var QuizDataSource = $resource<ng.resource.IResource<Quiz>>('/api/quizzes/:quizId', { 'quizId': '@quizId' }, {
            'update': { method: 'POST', params: { 'quizId': '@id' } }
        });


        return <IQuizService> {

            'delete': (quizId: number): ng.IPromise<void> => {
                return (<any>QuizDataSource).delete({ quizId: quizId }).$promise;
            },

            getAll: (): ng.IPromise<Quizzical.Quiz[]> => {
                return (<any>QuizDataSource).query().$promise;
            },

            getById: (quizId: number): ng.IPromise<Quizzical.Quiz> => {
                return new QuizDataSource({ quizId: quizId }).$get();
            },

            save: (quiz: Quizzical.Quiz): ng.IPromise<Quizzical.Quiz> => {
                if (!quiz.id) {
                    return new QuizDataSource(quiz).$save();
                } else {
                    return (<any>QuizDataSource).update(quiz).$promise;
                }
            }
        };

    }


    angular.module('Quizzical.Services')
        .service('QuizService', QuizService);

}