module Quizzical {


    export function GenerateStubData() {

        var quizzes = [
            <Quiz>{
                id: 1,
                name: 'Test Quiz #1',
                questions: [
                    <Question>{
                        id: 1,
                        description: 'Is the sky blue?',
                        questionType: QuestionType.TrueFalse,
                    }
                ]
            }
        ];

        var sessions = [
            <QuizSession>{
                id: 1,
                connectedUserIds: [],
                currentQuestionId: null,
                quizId: 1
            }
        ];


        var users = [
            <User>{
                id: '1',
                name: 'Test User'
            },
            <User>{
                id: '2',
                name: 'Admin User'
            }
        ];



        function findSessionByQuizId(quizId: number) {
            var matches = sessions.filter(s => s.quizId == quizId);
            return (matches.length) ? matches[0] : null;
        }


        return {
            quizzes: quizzes,
            findQuiz: finder(quizzes),

            sessions: sessions,
            findSession: finder(sessions),
            findSessionByQuizId: findSessionByQuizId,

            users: users,
            findUser: finder(users),
        };
    }




    function finder(entities: any[]) {
        return (id?: any) => {
            if (!entities.length) return null;
            if (!angular.isDefined(id)) return entities[0];

            var matches = entities.filter(s => s.id == id);
            return (matches.length) ? matches[0] : null;
        };
    }
} 