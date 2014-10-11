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

    describe('QuestionService', () => {

        var service: IQuestionService,
            quizId: number = 123,
            question: Question = {
                id: 456,
                description: 'Why is the sky blue?',
                extendedDescription: '',
                questionType: QuestionType.OpenEnded,
                options: [],
            };

        beforeEach(inject((QuestionService: IQuestionService) => {
            service = QuestionService;
        }));


        it('should get all questions for a quiz', (done) => {

            expect(quizId).toBeDefined();
            $httpBackend.expectGET(getApiUrl())
                        .respond([question]);

            service.getAll(quizId).then(resp => {
                expect(resp[0].id).toBe(question.id);
                expect(resp[0].description).toBe(question.description);
                done();
            });

            $httpBackend.flush();
        });

        it('should get question by id', (done) => {

            $httpBackend.expectGET(getApiUrl(question.id))
                        .respond(question);

            service.getById(quizId, question.id).then(resp => {
                expect(resp.id).toBe(question.id);
                expect(resp.description).toBe(question.description);
                done();
            });

            $httpBackend.flush();
        });

        it('should create new question', (done) => {
            var newQuestion: Question = angular.copy(question);
            newQuestion.id = 0;

            $httpBackend.expectPOST(getApiUrl())
                        .respond(question);

            service.save(quizId, newQuestion)
                .then(resp => {
                    expect(resp.id).not.toBe(newQuestion.id);
                    expect(resp.description).toBe(newQuestion.description);
                    done();
                });

            $httpBackend.flush();
        });

        it('should delete existing question by id', (done) => {

            $httpBackend.expectDELETE(getApiUrl(question.id))
                        .respond(200);

            service.delete(quizId, question.id)
                   .then(done);

            $httpBackend.flush();
        });

        it('should update existing question', (done) => {
            var updated: Question = angular.copy(question);
            updated.description = 'Updated Test Question';

            $httpBackend.expectPOST(getApiUrl(updated.id))
                .respond(updated);

            service.save(quizId, updated).then(resp => {
                expect(resp.id).toBe(updated.id);
                expect(resp.description).toBe(updated.description);
                done();
            });

            $httpBackend.flush();
        });

        function getApiUrl(questionId?: number, action?: string) {
            var parts : any[] = ['/api/quizzes', quizId, 'questions'];

            if (questionId) parts.push(questionId);
            if (action) parts.push(action);

            return parts.join('/');
        }

    });
}