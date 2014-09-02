/// <reference path="../model.ts" />
/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />

module Quizzical {

    interface SessionListViewModel {
        selectedSession: QuizSession;
        sessions: QuizSession[];

        selectSession(session: QuizSession): void;
    }

    class SessionListController {

        static $inject = ['scope'];

        constructor(viewModel: SessionListViewModel) {

            viewModel.selectSession = (session: QuizSession) => {
                viewModel.selectedSession = session;
            }

        }

    }

    angular.module('Quizzical').controller('SessionListController', SessionListController);
}