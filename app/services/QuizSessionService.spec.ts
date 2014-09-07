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

    describe('QuizSessionService', () => {

        var service, quizSessionsApiUrl = '/api/quizzes';

        beforeEach(inject((QuizSessionService: IQuizSessionService) => {
            service = QuizSessionService;
        }));


        it('should create new session', (done) => {
            var quiz = StubData.findQuiz();

            $httpBackend.expectPOST([quizSessionsApiUrl, quiz.id, 'sessions'].join('/'))
                        .respond(<QuizSession>{ quizId: quiz.id });

            service.create(quiz.id).then(session => {
                expect(session.quizId).toBe(quiz.id);
                done();
            });

            $httpBackend.flush();
        });


        it('should list available sessions', (done) => {

            $httpBackend.expectGET('/api/quizSessions').respond(StubData.sessions);

            service.list().then(sessions => {
                expect(sessions).toContainAllItemsIn(StubData.sessions);
                done();
            });

            $httpBackend.flush();
        });


        it('should join available session', (done) => {

            var quiz = StubData.findQuiz(),
                session = StubData.findSession();

            $httpBackend.expectPOST([quizSessionsApiUrl, quiz.id, 'sessions', session.id, 'join'].join('/'))
                .respond(session);

            service.join(quiz.id, session.id).then(joined => {
                expect(joined.id).toBe(session.id);
                done();
            });

            $httpBackend.flush();
        });

    });
}