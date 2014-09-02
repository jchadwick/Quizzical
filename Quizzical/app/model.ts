module Quizzical {

	export interface User {
		id: string;
		name: string;
	}

	export interface Quiz {
		id: number;
		name: string;
		questions: Question[];
	}

	export interface Question {
		id: number;
		description: string;
		extendedDescription: string;
		questionType: QuestionType;
		options: QuestionOption[];
	}

	export enum QuestionType {
		Unknown,
		TrueFalse,
		MultipleChoice,
		OpenEnded
	}

	export interface QuestionOption {
		id: number;
		description: string;
	}

	export interface Answer {
		id: number;
		questionId: number;
		questionOptionId: number;
		quizId: number;
        quizSessionId: number;
		userId: string;
	}

	export interface QuizSession {
		id: number;
        quizId: number;
		connectedUserIds: string[];
		currentQuestionId: number;
	}

}
