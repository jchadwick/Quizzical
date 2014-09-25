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

    describe('AnswerService', () => {

        var service: IAnswerService,
            quizId: number = 123,
            sessionId: number = 200,
            questionId: number = 456,
            answer: Answer = {
                questionId: questionId,
                questionOptionId: 42,
                sessionId: sessionId,
                userId: "testuser",
            };

        beforeEach(inject((AnswerService: IAnswerService) => {
            service = AnswerService;
        }));


        it('should get all answers for a question in a session', (done) => {

            expect(quizId).toBeDefined();
            $httpBackend.expectGET(getApiUrl(quizId, sessionId, questionId))
                .respond([answer]);

            service.getAll(quizId, questionId, sessionId).then(resp => {
                expect(resp[0].questionId).toBe(answer.questionId);
                expect(resp[0].questionOptionId).toBe(answer.questionOptionId);
                done();
            });

            $httpBackend.flush();
        });

        it('should submit an answer to a question', (done) => {

            $httpBackend.expectPOST(getApiUrl(quizId, sessionId, questionId))
                .respond(answer);

            service.submit(quizId, answer)
                .then(resp => {
                    expect(resp.questionId).toBe(answer.questionId);
                    expect(resp.questionOptionId).toBe(answer.questionOptionId);
                    done();
                });

            $httpBackend.flush();
        });

        it('should provide a summary of the answers to a question', (done) => {

            var answers: Answer[] = [
                angular.extend(angular.copy(answer), { questionOptionId: 1 }),
                angular.extend(angular.copy(answer), { questionOptionId: 2 }),
                angular.extend(angular.copy(answer), { questionOptionId: 2 }),
            ];

            $httpBackend.expectGET(getApiUrl(quizId, sessionId, questionId, 'summary'))
                .respond(answers);

            service.getSummary(quizId, questionId, sessionId)
                .then((resp: AnswersSummary) => {
                    var option1Summary: AnswerSummary = resp.answers.filter((a) => a.questionOptionId == 1)[0];
                    var option2Summary: AnswerSummary = resp.answers.filter((a) => a.questionOptionId == 2)[0];

                    expect(option1Summary.count).toBe(1);
                    expect(option1Summary.percentage).toBe(33);

                    expect(option2Summary.count).toBe(2);
                    expect(option2Summary.percentage).toBe(66);

                    done();
                });

            $httpBackend.flush();
        });


        function getApiUrl(quizId?: number, sessionId?: number, questionId?: number, action?: string) {
            var parts: any[] = ['/api/quizzes'];

            if (quizId) parts.push(quizId);
            parts.push('sessions');
            if (sessionId) parts.push(sessionId);
            parts.push('questions');
            if (questionId) parts.push(questionId);
            parts.push('answers');
            if (action) parts.push(action);

            return parts.join('/');
        }

    });
}