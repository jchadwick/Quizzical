/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../typings/custom/jasmine-matchers.d.ts" />

var $location, $scope, $timeout, $httpBackend, createController;

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


beforeEach(() => {
    jasmine.addMatchers({
        toContainAllItems: () => {
            return {
                compare: (actual, expected) => {
                    var matches = true;

                    expected.forEach(x => {
                        var count = actual.filter(y => y.id == x.id).length;
                        if (count == 0)
                            matches = false;
                    });

                    return {
                        pass: matches
                    };
                }
            };
        }
    });
});
