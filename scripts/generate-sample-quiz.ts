import { PrismaClient } from "@prisma/client";

// Node.js globals
declare const process: any;
declare const require: any;
declare const module: any;

const prisma = new PrismaClient();

interface QuizTemplate {
	title: string;
	description: string;
	tags: string[];
	visibility: "PUBLIC" | "PRIVATE";
	image?: string;
	questions: {
		text: string;
		image?: string;
		answers: {
			text: string;
			isCorrect: boolean;
		}[];
	}[];
}

const quizTemplates: { [key: string]: QuizTemplate } = {
	programming: {
		title: "Programming Fundamentals",
		description: "Test your knowledge of basic programming concepts",
		tags: ["programming", "coding", "fundamentals"],
		visibility: "PUBLIC",
		image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
		questions: [
			{
				text: "What is a variable in programming?",
				answers: [
					{ text: "A container for storing data values", isCorrect: true },
					{ text: "A type of loop", isCorrect: false },
					{ text: "A function parameter", isCorrect: false },
					{ text: "A programming language", isCorrect: false },
				],
			},
			{
				text: "Which of the following is NOT a programming paradigm?",
				answers: [
					{ text: "Object-Oriented Programming", isCorrect: false },
					{ text: "Functional Programming", isCorrect: false },
					{ text: "Procedural Programming", isCorrect: false },
					{ text: "Database Programming", isCorrect: true },
				],
			},
			{
				text: 'What does "DRY" stand for in programming?',
				answers: [
					{ text: "Do Repeat Yourself", isCorrect: false },
					{ text: "Don't Repeat Yourself", isCorrect: true },
					{ text: "Debug Regularly Yourself", isCorrect: false },
					{ text: "Deploy Ready Yearly", isCorrect: false },
				],
			},
		],
	},
	history: {
		title: "World History Quiz",
		description: "Test your knowledge of important historical events",
		tags: ["history", "world-events", "education"],
		visibility: "PUBLIC",
		image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400",
		questions: [
			{
				text: "In which year did World War II end?",
				answers: [
					{ text: "1944", isCorrect: false },
					{ text: "1945", isCorrect: true },
					{ text: "1946", isCorrect: false },
					{ text: "1947", isCorrect: false },
				],
			},
			{
				text: "Who was the first person to walk on the moon?",
				answers: [
					{ text: "Buzz Aldrin", isCorrect: false },
					{ text: "Neil Armstrong", isCorrect: true },
					{ text: "John Glenn", isCorrect: false },
					{ text: "Alan Shepard", isCorrect: false },
				],
			},
			{
				text: "The Berlin Wall fell in which year?",
				answers: [
					{ text: "1987", isCorrect: false },
					{ text: "1988", isCorrect: false },
					{ text: "1989", isCorrect: true },
					{ text: "1990", isCorrect: false },
				],
			},
		],
	},
	science: {
		title: "Basic Science Quiz",
		description:
			"Explore fundamental concepts in physics, chemistry, and biology",
		tags: ["science", "physics", "chemistry", "biology"],
		visibility: "PUBLIC",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
		questions: [
			{
				text: "What is the speed of light in a vacuum?",
				answers: [
					{ text: "299,792,458 m/s", isCorrect: true },
					{ text: "300,000,000 m/s", isCorrect: false },
					{ text: "186,000 miles/s", isCorrect: false },
					{ text: "150,000,000 m/s", isCorrect: false },
				],
			},
			{
				text: 'Which element has the chemical symbol "Fe"?',
				answers: [
					{ text: "Fluorine", isCorrect: false },
					{ text: "Iron", isCorrect: true },
					{ text: "Francium", isCorrect: false },
					{ text: "Fermium", isCorrect: false },
				],
			},
			{
				text: "What is the powerhouse of the cell?",
				answers: [
					{ text: "Nucleus", isCorrect: false },
					{ text: "Ribosome", isCorrect: false },
					{ text: "Mitochondria", isCorrect: true },
					{ text: "Endoplasmic Reticulum", isCorrect: false },
				],
			},
		],
	},
	geography: {
		title: "World Geography Challenge",
		description: "Test your knowledge of countries, capitals, and landmarks",
		tags: ["geography", "countries", "capitals", "world"],
		visibility: "PUBLIC",
		image: "https://images.unsplash.com/photo-1519302959554-a75be0afc82a?w=400",
		questions: [
			{
				text: "What is the capital of Australia?",
				answers: [
					{ text: "Sydney", isCorrect: false },
					{ text: "Melbourne", isCorrect: false },
					{ text: "Canberra", isCorrect: true },
					{ text: "Perth", isCorrect: false },
				],
			},
			{
				text: "Which is the longest river in the world?",
				answers: [
					{ text: "Amazon River", isCorrect: false },
					{ text: "Nile River", isCorrect: true },
					{ text: "Mississippi River", isCorrect: false },
					{ text: "Yangtze River", isCorrect: false },
				],
			},
			{
				text: "Mount Everest is located in which mountain range?",
				answers: [
					{ text: "Andes", isCorrect: false },
					{ text: "Rocky Mountains", isCorrect: false },
					{ text: "Alps", isCorrect: false },
					{ text: "Himalayas", isCorrect: true },
				],
			},
		],
	},
	sports: {
		title: "Sports Trivia",
		description: "Test your knowledge of various sports and athletes",
		tags: ["sports", "trivia", "athletes", "games"],
		visibility: "PUBLIC",
		image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
		questions: [
			{
				text: "How many players are on a basketball team on the court at one time?",
				answers: [
					{ text: "4", isCorrect: false },
					{ text: "5", isCorrect: true },
					{ text: "6", isCorrect: false },
					{ text: "7", isCorrect: false },
				],
			},
			{
				text: "In which sport would you perform a slam dunk?",
				answers: [
					{ text: "Volleyball", isCorrect: false },
					{ text: "Basketball", isCorrect: true },
					{ text: "Tennis", isCorrect: false },
					{ text: "Baseball", isCorrect: false },
				],
			},
			{
				text: "The FIFA World Cup is held every how many years?",
				answers: [
					{ text: "2 years", isCorrect: false },
					{ text: "3 years", isCorrect: false },
					{ text: "4 years", isCorrect: true },
					{ text: "5 years", isCorrect: false },
				],
			},
		],
	},
};

async function generateSampleQuiz(category: string, creatorEmail: string) {
	try {
		console.log(`🔄 Generating ${category} quiz...`);

		// Find the creator user
		const creator = await prisma.user.findUnique({
			where: { email: creatorEmail },
		});

		if (!creator) {
			throw new Error(`User with email ${creatorEmail} not found`);
		}

		// Get the quiz template
		const template = quizTemplates[category.toLowerCase()];
		if (!template) {
			throw new Error(`Quiz template for category "${category}" not found`);
		}

		// Create the quiz
		const quiz = await prisma.quiz.create({
			data: {
				title: template.title,
				description: template.description,
				tags: template.tags,
				visibility: template.visibility,
				image: template.image,
				creatorId: creator.id,
				questions: {
					create: template.questions.map((question, index) => ({
						text: question.text,
						image: question.image,
						position: index + 1,
						answers: {
							create: question.answers.map((answer, answerIndex) => ({
								text: answer.text,
								isCorrect: answer.isCorrect,
								position: answerIndex + 1,
							})),
						},
					})),
				},
			},
			include: {
				questions: {
					include: {
						answers: true,
					},
				},
				creator: true,
			},
		});

		console.log(`✅ Created quiz: "${quiz.title}" by ${quiz.creator.name}`);
		console.log(`   📝 Questions: ${quiz.questions.length}`);
		console.log(
			`   💡 Total answers: ${quiz.questions.reduce((acc, q) => acc + q.answers.length, 0)}`
		);
		console.log(`   🏷️  Tags: ${quiz.tags.join(", ")}`);

		return quiz;
	} catch (error) {
		console.error("❌ Error generating sample quiz:", error);
		throw error;
	}
}

async function main() {
	const args = process.argv.slice(2);

	if (args.length < 2) {
		console.log("📋 Usage: npm run generate-quiz <category> <creator-email>");
		console.log("\n📚 Available categories:");
		Object.keys(quizTemplates).forEach((category) => {
			console.log(`   • ${category}`);
		});
		console.log(
			"\n💡 Example: npm run generate-quiz programming john.doe@test.com"
		);
		return;
	}

	const [category, creatorEmail] = args;

	try {
		await generateSampleQuiz(category, creatorEmail);
		console.log("\n✨ Sample quiz generated successfully!");
	} catch (error) {
		console.error("❌ Failed to generate sample quiz:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

// Check if this script is being run directly
if (typeof require !== "undefined" && require.main === module) {
	main();
}

export { generateSampleQuiz, quizTemplates };
