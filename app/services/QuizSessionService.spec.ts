/// <reference path="../model.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../typings/jasmine/jasmine-matchers.d.ts" />
/// <reference path="../../typings/custom/jasmine-matchers.d.ts" />
var $httpBackend: ng.IHttpBackendService;

module Quizzical {
    'use strict';

    describe('QuizSessionService', () => {

        var sessions = [{ id: 1 }];
        var $http;
        
        beforeEach(inject((_$http_) => {
            $http = _$http_;
            $httpBackend.when('GET', '/api/quizSessions').respond(sessions);
        }));

        it('should work', () => {


            $httpBackend.flush();
        })

    })
}