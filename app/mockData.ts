/// <reference path="model.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../typings/angularjs/angular-mocks.d.ts" />

module Quizzical.App {


    class MockData {
        Questions: Question[];
        Quizzes: Quiz[];
        Sessions: QuizSession[];

        constructor() {
            var id = 1;

            var trueFalseOptions: QuestionOption[] = [{ id: 1, description: "True" }, { id: 2, description: "False" }];

            var questionCount = 10;
            this.Questions = [questionCount].map(() => {
                return <Question>{
                    id: id += 1,
                    description: 'What is ' + id + ' + 200?',
                    options: trueFalseOptions
                };
            });

            var quizCount = 10;
            this.Quizzes = [quizCount].map(() => {
                return <Quiz>{
                    id: id += 1,
                    name: 'Test Quiz #' + id,
                    questions: this.Questions,
                };
            });

            var sessionCount = 10;
            this.Sessions = [sessionCount].map((idx) => {
                return <QuizSession>{
                    id: id += 1,
                    quizId: idx,
                    connectedUserIds: [],
                    currentQuestionId: 0, 
                };
            }); 
        }


        findQuestion(questionId: number) {
            return this.Questions.filter(x => x.id == questionId)[0];
        }
        findQuestions(quizId: number) {
            return this.Quizzes.filter(x => x.id == quizId)[0].questions;
        }

        findQuiz(quizId: number) {
            return this.Quizzes.filter(x => x.id == quizId)[0];
        }

        findSession(sessionId: number) {
            return this.Sessions.filter(x => x.id == sessionId)[0];
        }
        findSessions(quizId: number) {
            return this.Sessions.filter(x => x.quizId == quizId)[0];
        }
    }



    class MockDataBackend {

        static $inject = ['$httpBackend'];

        private mockData: MockData;

        constructor(private $httpBackend: ng.IHttpBackendService) {
            this.mockData = new MockData();
        }

        initialize() {
            var $httpBackend = this.$httpBackend;

            $httpBackend.whenGET('/api/quizzes').respond((method, url) => {
                var quizzes = this.mockData.Quizzes;
                return [200, quizzes, {}];
            });
            $httpBackend.whenGET(/\/api\/quizzes\/\d+/).respond((method, url) => {
                var quiz = this.mockData.findQuiz(url.split('/')[3]);
                return [200, quiz, {}];
            });


            $httpBackend.whenGET(/\/api\/quizzes\/\d+\/\/sessions/).respond((method, url) => {
                var sessions = this.mockData.findSessions(url.split('/')[3]);
                return [200, sessions, {}];
            });
            $httpBackend.whenGET(/\/api\/quizzes\/\d+\/\/sessions\/\d+/).respond((method, url) => {
                var session = this.mockData.findSession(url.split('/')[5]);
                return [200, session, {}];
            });


            $httpBackend.whenGET(/\/api\/quizzes\/\d+\/\/sessions\/\d+\/\/questions/).respond((method, url) => {
                var questions = this.mockData.findQuestions(url.split('/')[5]);
                return [200, questions, {}];
            });

            $httpBackend.whenGET(/\/api\/quizzes\/\d+\/\/sessions\/\d+\/\/questions\/\d+/).respond((method, url) => {
                var question = this.mockData.findQuestion(url.split('/')[7]);
                return [200, question, {}];
            });

        }
    }


    angular.module('Quizzical.Mocks', ['ngMockE2E', 'ngResource'])
        .service('MockDataBackend', MockDataBackend)
        .run(['MockDataBackend', backend => { backend.initialize(); }]);

}