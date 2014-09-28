/// <reference path="../app/model.ts" />
/// <reference path="../typings/jasmine/jasmine.d.ts" />

var $location,
    $scope,
    $timeout,
    $httpBackend: ng.IHttpBackendService,
    createController;

beforeEach(module('Quizzical'));
beforeEach(module('Quizzical.Services'));
beforeEach(module('Quizzical.UI'));

beforeEach(inject(($rootScope, $controller, _$location_, _$timeout_, _$httpBackend_) => {
    $httpBackend = _$httpBackend_;
    $location = _$location_;
    $timeout = _$timeout_;
    $scope = $rootScope.$new(); 

    createController = (name, scope) => {
        var scp = scope || $scope;
        var cntlr = $controller(name, { '$scope': scp });
        return cntlr;
    };
}));
