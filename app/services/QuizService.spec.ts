/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../typings/jasmine/jasmine-matchers.d.ts" />
/// <reference path="../../testing/matchers.d.ts" />

var $httpBackend: ng.IHttpBackendService;

module Quizzical {
    'use strict';

    describe('QuizService', () => {

        var service;

        beforeEach(inject((QuizService: IQuizService) => {
            service = QuizService;
        }));


        it('should get all quizzes', (done) => {
            var quiz: Quiz = { id: 1, name: 'Test Quiz', questions: [] };

            $httpBackend.expectGET(getApiUrl())
                        .respond([quiz]);

            service.getAll().then(resp => {
                expect(resp[0].id).toBe(quiz.id);
                expect(resp[0].name).toBe(quiz.name);
                done();
            });

            $httpBackend.flush();
        });

        it('should get quiz by id', (done) => {
            var quiz: Quiz = { id: 1, name: 'Test Quiz', questions: [] };

            $httpBackend.expectGET(getApiUrl(quiz.id))
                        .respond(quiz);

            service.getById(quiz.id).then(resp => {
                expect(resp.id).toBe(quiz.id);
                expect(resp.name).toBe(quiz.name);
                done();
            });

            $httpBackend.flush();
        });

        it('should create new quiz', (done) => {
            var quiz: Quiz = { id: null, name: 'Test Quiz', questions: [] };

            $httpBackend.expectPOST(getApiUrl())
                        .respond(quiz);

            service.save(quiz)
                .then(resp => {
                    expect(resp.id).toBe(quiz.id);
                    expect(resp.name).toBe(quiz.name);
                    done();
                });

            $httpBackend.flush();
        });

        it('should delete existing quiz by id', (done) => {
            var quizId = 123;

            $httpBackend.expectDELETE(getApiUrl(quizId))
                        .respond(200);

            service.delete(quizId)
                   .then(done);

            $httpBackend.flush();
        });

        it('should update existing quiz', (done) => {
            var updated: Quiz = { id: 123, name: 'Updated Test Quiz', questions: [] };

            $httpBackend.expectPOST(getApiUrl(updated.id))
                .respond(updated);

            service.save(updated).then(resp => {
                expect(resp.id).toBe(updated.id);
                expect(resp.name).toBe(updated.name);
                done();
            });

            $httpBackend.flush();
        });


        function getApiUrl(quizId?: number, action?: string) {
            var parts : any[] = ['/api/quizzes'];

            if (quizId) parts.push(quizId);
            if (action) parts.push(action);

            return parts.join('/');
        }

    });
}