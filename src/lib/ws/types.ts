interface SessionCreatedData {
	sessionId: string;
	quizId: string;
	type: "SOLO" | "LIVE";
	participantId: string;
}

interface QuestionData {
	questionId: string;
	text: string;
	image?: string;
	answers: AnswerOption[];
	questionNumber: number;
	totalQuestions: number;
	timeLimit?: number;
}

interface AnswerOption {
	id: string;
	text: string;
}

interface AnswerResultData {
	isCorrect: boolean;
	correctAnswerId: string;
	pointsEarned: number;
	explanation?: string;
	currentScore: number;
}

interface SessionResultData {
	totalScore: number;
	correctAnswers: number;
	totalQuestions: number;
	averageTimePerQuestion: number;
	accuracy: number;
}

interface ErrorData {
	code: string;
	message: string;
	details?: any;
	recoverable: boolean;
}
