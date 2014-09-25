/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />

module Quizzical {
    'use strict';

    export interface IQuizService {
        delete(quiz: Quiz): ng.IPromise<void>;
        delete(quizId: number): ng.IPromise<void>;
        getAll(): ng.IPromise<Quiz[]>;
        getById(quizId: number): ng.IPromise<Quiz>;
        save(quiz: Quiz): ng.IPromise<Quiz>;
    }

    interface IQuiz extends Quiz, ng.resource.IResource<IQuiz> {
    }

    interface IQuizDataSource extends ng.resource.IResourceClass<IQuiz> {
        update(quiz: Quiz): ng.IPromise<Quiz>;
    }

    class QuizService implements IQuizService {

        static $inject = ['QuizDataSource'];

        constructor(private QuizDataSource: IQuizDataSource) {
            this.CreateQuizCommand = (q?: any) => {
              return new QuizDataSource(q);
            };
        }

        private CreateQuizCommand(q?: any): IQuiz {
            throw 'NotImplemented';
        }

        'delete'(quiz:Quizzical.Quiz): ng.IPromise<void>;
        'delete'(quizId:number): ng.IPromise<void>;
        'delete'(parm: any): ng.IPromise<void> {
            var quizId : number =
                angular.isNumber(parm)
                    ? parm
                    : (parm && parm.id ? parm.id : null);

            return (<any>this.QuizDataSource.delete({ quizId: quizId })).$promise;
        }

        getAll():ng.IPromise<Quizzical.Quiz[]> {
            return (<any>this.QuizDataSource.query()).$promise;
        }

        getById(quizId:number):ng.IPromise<Quizzical.Quiz> {
            return this.CreateQuizCommand({ quizId: quizId }).$get();
        }

        save(quiz:Quizzical.Quiz):ng.IPromise<Quizzical.Quiz> {
            if(!quiz.id) {
                return this.CreateQuizCommand(quiz).$save();
            } else {
                return (<any>this.QuizDataSource.update(quiz)).$promise;
            }
        }

    }

    angular.module('Quizzical.Services')
        .factory('QuizDataSource', ['$resource', ($resource: ng.resource.IResourceService) => {
            return $resource<Quiz>('/api/quizzes/:quizId', { 'quizId': '@quizId'}, {
                'update': { method: 'POST', params: { 'quizId': '@id' } }
            });
        }]);

    angular.module('Quizzical.Services')
        .service('QuizService', QuizService);

}