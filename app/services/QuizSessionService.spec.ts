/// <reference path="../model.ts" />
/// <reference path="QuizSessionService.ts" />
/// <reference path="../mockData.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../typings/jasmine/jasmine-matchers.d.ts" />
/// <reference path="../../testing/matchers.d.ts" />

var $httpBackend: ng.IHttpBackendService;

module Quizzical {
    'use strict';

    describe('QuizSessionService', () => {

        var service: IQuizSessionService, mockData: MockData;

        beforeEach(inject((QuizSessionService: IQuizSessionService, MockData: MockData) => {
            service = QuizSessionService;
            mockData = MockData;
        }));


        it('should create new session', (done) => {
            var quiz = mockData.findQuiz();

            $httpBackend.expectPOST(getApiUrl(quiz.id))
                        .respond(<QuizSession>{ quizId: quiz.id });

            service.create(quiz.id).then(session => {
                expect(session.quizId).toBe(quiz.id);
                done();
            });

            $httpBackend.flush();
        });


        xit('should list available sessions for all quizzes', (done) => {

            $httpBackend.expectGET('/api/quizzes/sessions/available')
                        .respond(mockData.Sessions);

            service.list().then(sessions => {
                expect(sessions).toContainAllItemsIn(mockData.Sessions);
                done();
            });

            $httpBackend.flush();
        });


        xit('should list sessions for a quiz', (done) => {
            var quiz = mockData.findQuiz();

            $httpBackend.expectGET(getApiUrl(quiz.id)).respond(mockData.Sessions);

            service.list().then(sessions => {
                expect(sessions).toContainAllItemsIn(mockData.Sessions);
                done();
            });

            $httpBackend.flush();
        });


        it('should join available session', (done) => {

            var session = mockData.findSession();

            $httpBackend.expectPOST(getApiUrl(session.quizId, session.id, 'join'))
                .respond(session);

            service.join(session.quizId, session.id).then(joined => {
                expect(joined.id).toBe(session.id);
                done();
            });

            $httpBackend.flush();
        });


        function getApiUrl(quizId?: number, sessionId?: number, action?: string) {
            var parts : any[] = ['/api/quizzes'];

            if (quizId) parts.push(quizId);
            parts.push('sessions');
            if (sessionId) parts.push(sessionId);
            if (action) parts.push(action);

            return parts.join('/');
        }

    });
}