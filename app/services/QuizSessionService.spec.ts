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

            $httpBackend.expectPOST(getApiUrl())
                        .respond(<QuizSession>{ quizId: quiz.id });

            service.create(quiz.id).then(session => {
                expect(session.quizId).toBe(quiz.id);
                done();
            });

            $httpBackend.flush();
        });

        it('should NOT create new session given an invalid quiz id', () => {
            expect(() => service.create(null)).toThrow('Invalid Quiz Id');
        });


        it('should list available sessions', (done) => {

            $httpBackend.expectGET(getApiUrl(null, 'available'))
                        .respond(mockData.Sessions);

            service.list().then(sessions => {
                expect(sessions).toContainAllItemsIn(mockData.Sessions);
                done();
            });

            $httpBackend.flush();
        });


        it('should get session by id', (done) => {

            var session = mockData.findSession();

            $httpBackend.expectGET(getApiUrl(session.id))
                        .respond(session);

            service.getById(session.id).then(result => {
                expect(result).toBeDefined();
                expect(result.id).toBe(session.id);
                done();
            });

            $httpBackend.flush();
        });

        it('should NOT get session given an invalid session id', () => {
            expect(() => service.getById(null)).toThrow('Invalid Session Id');
        });



        it('should join available session', (done) => {

            var session = mockData.findSession();

            $httpBackend.expectPOST(getApiUrl(session.id, 'join'))
                        .respond(session);

            service.join(session.id).then(joined => {
                expect(joined.id).toBe(session.id);
                done();
            });

            $httpBackend.flush();
        });

        it('should NOT join available session given an invalid session id', () => {
            expect(() => service.join(null)).toThrow('Invalid Session Id');
        });


        function getApiUrl(sessionId?: number, action?: string) {
            var parts : any[] = ['/api/sessions'];

            if (sessionId) parts.push(sessionId);
            if (action) parts.push(action);

            return parts.join('/');
        }

    });
}