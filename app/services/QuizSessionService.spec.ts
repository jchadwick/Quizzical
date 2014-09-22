/// <reference path="../model.ts" />
/// <reference path="../../testing/StubData.ts" />
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

        var service;

        beforeEach(inject((QuizSessionService: IQuizSessionService) => {
            service = QuizSessionService;
        }));


        it('should create new session', (done) => {
            var quiz = StubData.findQuiz();

            $httpBackend.expectPOST(getApiUrl(quiz.id))
                        .respond(<QuizSession>{ quizId: quiz.id });

            service.create(quiz.id).then(session => {
                expect(session.quizId).toBe(quiz.id);
                done();
            });

            $httpBackend.flush();
        });


        it('should list available sessions for all quizzes', (done) => {

            $httpBackend.expectGET(getApiUrl(null, null, 'available')).respond(StubData.sessions);

            service.list().then(sessions => {
                expect(sessions).toContainAllItemsIn(StubData.sessions);
                done();
            });

            $httpBackend.flush();
        });


        it('should list sessions for a quiz', (done) => {
            var quiz = StubData.findQuiz();

            $httpBackend.expectGET(getApiUrl(quiz.id)).respond(StubData.sessions);

            service.list(quiz.id).then(sessions => {
                expect(sessions).toContainAllItemsIn(StubData.sessions);
                done();
            });

            $httpBackend.flush();
        });


        it('should join available session', (done) => {

            var quiz = StubData.findQuiz(),
                session = StubData.findSessionByQuizId(quiz.id);

            $httpBackend.expectPOST(getApiUrl(quiz.id, session.id, 'join'))
                .respond(session);

            service.join(quiz.id, session.id).then(joined => {
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