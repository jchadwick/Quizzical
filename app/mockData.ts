/// <reference path="model.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../typings/angularjs/angular-mocks.d.ts" />

module Quizzical {


    export class MockData {
        Answers: Answer[] = [];
        Questions: Question[] = [];
        Quizzes: Quiz[] = [];
        Sessions: QuizSession[] = [];
        Users: User[];

        private currentId: number = 1;

        generate(times, create) {
            var items = [];
            for (var i = 0; i < times; i++) {
                var id = (this.currentId += 1);
                items.push(create(id));
            }
            return items;
        }

        constructor() {

            this.Users = this.generate(10, (id) => {
                return <User>{
                    id: 'testuser' + id,
                    name: 'Test User #' + id,
                };
            });

            var trueFalseOptions: QuestionOption[] = [
                { id: 1, description: "True" },
                { id: 2, description: "False" }
            ];

            this.Questions = this.generate(100, (id) => {
                return <Question>{
                    id: id,
                    description: 'What is ' + id + ' + 200?',
                    options: trueFalseOptions
                };
            });

            this.Quizzes = this.generate(10, (id) => {
                return <Quiz>{
                    id: id,
                    name: 'Test Quiz #' + id,
                    questions: this.Questions,
                };
            });

            this.Sessions = this.generate(5, (id) => {
                return <QuizSession>{
                    id: id,
                    quizId: this.random(this.Quizzes).id,
                    connectedUserIds: [this.random(this.Users).id, this.random(this.Users).id+1],
                    currentQuestionId: Math.floor(Math.random() * 100),
                };
            });
        }


        random<T>(arr: T[]): T {
            if (!arr || arr.length == 0)
                return null;

            return arr[0];
        }


        findQuestion(questionId?: number) {
            if (!questionId)
                return this.Questions[0];

            return this.Questions.filter(x => x.id == questionId)[0];
        }
        findQuestions(quizId: number) {
            return this.Quizzes.filter(x => x.id == quizId)[0].questions;
        }

        findAnswer(answerId?: number) {
            if (!answerId)
                return this.Answers[0];

            return this.Answers.filter(x => x.id == answerId)[0];
        }

        findAnswers(sessionId: number, questionId: number) {
            return this.Answers.filter((x: Answer) => x.sessionId == sessionId && x.questionId == questionId);
        }

        addAnswer(answer: Answer) {
            return this.Answers.push(answer);
        }

        findQuiz(quizId?: number) {
            if (!quizId)
                return this.Quizzes[0];

            return this.Quizzes.filter(x => x.id == quizId)[0];
        }

        findSession(sessionId?: number) {
            if (!sessionId)
                return this.Sessions[0];

            return this.Sessions.filter(x => x.id == sessionId)[0];
        }
        findSessions(quizId: number) {
            return this.Sessions.filter(x => x.quizId == quizId)[0];
        }

        findUser(userId?: string) {
            if (!userId)
                return this.Users[0];

            return this.Users.filter(x => x.id == userId)[0];
        }
    }



    class MockDataBackend {

        static $inject = ['$httpBackend', '$log'];

        private mockData: MockData;

        constructor(private $httpBackend: ng.IHttpBackendService,
                    private $log: ng.ILogService) {
            this.mockData = new MockData();
        }

        initialize() {
            this.$log.debug('Initializing mock data service calls...');

            var $httpBackend = this.$httpBackend;

            $httpBackend.whenGET(/\.html$/).passThrough();

            $httpBackend.whenGET('/api/quizzes').respond((method, url) => {
                var quizzes = this.mockData.Quizzes;
                return [200, quizzes, {}];
            });
            $httpBackend.whenGET(/\/api\/quizzes\/\d+$/).respond((method, url) => {
                var quiz = this.mockData.findQuiz(url.split('/')[3]);
                return [200, quiz, {}];
            });


            $httpBackend.whenPOST(/^\/api\/sessions\/\d+\/questions\/\d+\/answer$/).respond((method, url, data) => {
                this.mockData.addAnswer(data);
                return [200, data, {}];
            });
            $httpBackend.whenGET(/^\/api\/sessions\/\d+\/questions\/\d+\/answers$/).respond((method, url) => {
                var answers = this.mockData.findAnswers(url.split('/')[5], url.split('/')[7]);
                return [200, answers, {}];
            });
            $httpBackend.whenGET(/^\/api\/sessions\/available$/).respond((method, url) => {
                var sessions = this.mockData.Sessions;
                return [200, sessions, {}];
            });
            $httpBackend.whenPOST(/^\/api\/sessions\/\d+\/join$/).respond((method, url) => {
                var session = this.mockData.findSession(url.split('/')[5]);
                return [200, session, {}];
            });
            $httpBackend.whenGET(/^\/api\/sessions\/\d+$/).respond((method, url) => {
                var session = this.mockData.findSession(url.split('/')[5]);
                return [200, session, {}];
            });
            $httpBackend.whenGET(/^\/api\/sessions$/).respond((method, url) => {
                var sessions = this.mockData.findSessions(url.split('/')[3]);
                return [200, sessions, {}];
            });


            $httpBackend.whenGET(/\/api\/quizzes\/\d+\/questions$/).respond((method, url) => {
                var questions = this.mockData.findQuestions(url.split('/')[5]);
                return [200, questions, {}];
            });

            $httpBackend.whenGET(/\/api\/quizzes\/\d+\/questions\/\d+$/).respond((method, url) => {
                var question = this.mockData.findQuestion(url.split('/')[5]);
                return [200, question, {}];
            });

        }
    }


    angular.module('Quizzical.MockData', ['ngMockE2E', 'ngResource'])
        .service('MockData', MockData)
        .service('MockDataBackend', MockDataBackend)
        .run(['MockDataBackend', backend => { backend.initialize(); }]);

}