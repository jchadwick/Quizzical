module Quizzical.App {

    function config() {
        // TODO:  App config
    }


    function init() {
        // TODO:  App startup
    }


    angular.module('Quizzical', ['Quizzical.Mocks']).config(config).run(init);
    angular.module('Quizzical.Services', ['ngResource']);
    angular.module('Quizzical.UI', []);
}