import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Test user data
const testUsers = [
	{
		name: "John Doe",
		email: "john.doe@test.com",
		password: "password123",
		emailVerified: true,
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
	},
	{
		name: "Jane Smith",
		email: "jane.smith@test.com",
		password: "password123",
		emailVerified: true,
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
	},
	{
		name: "Mike Johnson",
		email: "mike.johnson@test.com",
		password: "password123",
		emailVerified: true,
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
	},
	{
		name: "Sarah Wilson",
		email: "sarah.wilson@test.com",
		password: "password123",
		emailVerified: true,
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
	},
	{
		name: "Alex Brown",
		email: "alex.brown@test.com",
		password: "password123",
		emailVerified: true,
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
	},
];

// Test quiz data with questions and answers
const testQuizzes = [
	{
		title: "JavaScript Fundamentals",
		description: "Test your knowledge of JavaScript basics",
		tags: ["javascript", "programming", "web-development"],
		visibility: "PUBLIC" as const,
		image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
		questions: [
			{
				text: "What is the correct way to declare a variable in JavaScript?",
				position: 1,
				answers: [
					{ text: "var myVar = 5;", isCorrect: true, position: 1 },
					{ text: "variable myVar = 5;", isCorrect: false, position: 2 },
					{ text: "v myVar = 5;", isCorrect: false, position: 3 },
					{ text: "declare myVar = 5;", isCorrect: false, position: 4 },
				],
			},
			{
				text: "Which method is used to add an element to the end of an array?",
				position: 2,
				answers: [
					{ text: "push()", isCorrect: true, position: 1 },
					{ text: "pop()", isCorrect: false, position: 2 },
					{ text: "shift()", isCorrect: false, position: 3 },
					{ text: "unshift()", isCorrect: false, position: 4 },
				],
			},
			{
				text: 'What does "=== " operator do in JavaScript?',
				position: 3,
				answers: [
					{ text: "Assigns a value", isCorrect: false, position: 1 },
					{ text: "Compares values only", isCorrect: false, position: 2 },
					{
						text: "Compares both value and type",
						isCorrect: true,
						position: 3,
					},
					{ text: "Creates a new variable", isCorrect: false, position: 4 },
				],
			},
		],
	},
	{
		title: "React Basics Quiz",
		description: "Test your understanding of React fundamentals",
		tags: ["react", "frontend", "javascript"],
		visibility: "PUBLIC" as const,
		image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
		questions: [
			{
				text: "What is JSX?",
				position: 1,
				answers: [
					{
						text: "A JavaScript extension syntax",
						isCorrect: true,
						position: 1,
					},
					{ text: "A CSS framework", isCorrect: false, position: 2 },
					{ text: "A database query language", isCorrect: false, position: 3 },
					{ text: "A testing library", isCorrect: false, position: 4 },
				],
			},
			{
				text: "Which hook is used for state management in functional components?",
				position: 2,
				answers: [
					{ text: "useEffect", isCorrect: false, position: 1 },
					{ text: "useState", isCorrect: true, position: 2 },
					{ text: "useContext", isCorrect: false, position: 3 },
					{ text: "useReducer", isCorrect: false, position: 4 },
				],
			},
		],
	},
	{
		title: "General Knowledge Quiz",
		description: "A fun general knowledge quiz covering various topics",
		tags: ["general-knowledge", "trivia", "fun"],
		visibility: "PUBLIC" as const,
		image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400",
		questions: [
			{
				text: "What is the capital of France?",
				position: 1,
				answers: [
					{ text: "London", isCorrect: false, position: 1 },
					{ text: "Berlin", isCorrect: false, position: 2 },
					{ text: "Paris", isCorrect: true, position: 3 },
					{ text: "Madrid", isCorrect: false, position: 4 },
				],
			},
			{
				text: "Which planet is known as the Red Planet?",
				position: 2,
				answers: [
					{ text: "Venus", isCorrect: false, position: 1 },
					{ text: "Mars", isCorrect: true, position: 2 },
					{ text: "Jupiter", isCorrect: false, position: 3 },
					{ text: "Saturn", isCorrect: false, position: 4 },
				],
			},
			{
				text: "Who painted the Mona Lisa?",
				position: 3,
				answers: [
					{ text: "Vincent van Gogh", isCorrect: false, position: 1 },
					{ text: "Pablo Picasso", isCorrect: false, position: 2 },
					{ text: "Leonardo da Vinci", isCorrect: true, position: 3 },
					{ text: "Michelangelo", isCorrect: false, position: 4 },
				],
			},
		],
	},
	{
		title: "Math Challenge",
		description: "Test your mathematical skills with this challenging quiz",
		tags: ["math", "numbers", "challenge"],
		visibility: "PRIVATE" as const,
		image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
		questions: [
			{
				text: "What is 15 × 8?",
				position: 1,
				answers: [
					{ text: "120", isCorrect: true, position: 1 },
					{ text: "110", isCorrect: false, position: 2 },
					{ text: "130", isCorrect: false, position: 3 },
					{ text: "125", isCorrect: false, position: 4 },
				],
			},
			{
				text: "What is the square root of 144?",
				position: 2,
				answers: [
					{ text: "11", isCorrect: false, position: 1 },
					{ text: "12", isCorrect: true, position: 2 },
					{ text: "13", isCorrect: false, position: 3 },
					{ text: "14", isCorrect: false, position: 4 },
				],
			},
		],
	},
	{
		title: "Science Facts",
		description: "Discover interesting science facts and test your knowledge",
		tags: ["science", "biology", "physics", "chemistry"],
		visibility: "PUBLIC" as const,
		image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
		questions: [
			{
				text: "What is the chemical symbol for gold?",
				position: 1,
				answers: [
					{ text: "Go", isCorrect: false, position: 1 },
					{ text: "Au", isCorrect: true, position: 2 },
					{ text: "Ag", isCorrect: false, position: 3 },
					{ text: "Gd", isCorrect: false, position: 4 },
				],
			},
			{
				text: "How many bones are in the adult human body?",
				position: 2,
				answers: [
					{ text: "196", isCorrect: false, position: 1 },
					{ text: "206", isCorrect: true, position: 2 },
					{ text: "216", isCorrect: false, position: 3 },
					{ text: "226", isCorrect: false, position: 4 },
				],
			},
		],
	},
];

async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, 12);
}

async function createTestUsers() {
	console.log("🔄 Creating test users...");

	const createdUsers = [];

	for (const userData of testUsers) {
		const hashedPassword = await hashPassword(userData.password);

		const user = await prisma.user.upsert({
			where: { email: userData.email },
			update: {},
			create: {
				name: userData.name,
				email: userData.email,
				password: hashedPassword,
				emailVerified: userData.emailVerified,
				avatar: userData.avatar,
			},
		});

		createdUsers.push(user);
		console.log(`✅ Created user: ${user.name} (${user.email})`);
	}

	return createdUsers;
}

async function createTestQuizzes(users: any[]) {
	console.log("🔄 Creating test quizzes...");

	const createdQuizzes = [];

	for (let i = 0; i < testQuizzes.length; i++) {
		const quizData = testQuizzes[i];
		const creator = users[i % users.length]; // Distribute quizzes among users

		const quiz = await prisma.quiz.create({
			data: {
				title: quizData.title,
				description: quizData.description,
				tags: quizData.tags,
				visibility: quizData.visibility,
				image: quizData.image,
				creatorId: creator.id,
				questions: {
					create: quizData.questions.map((question) => ({
						text: question.text,
						position: question.position,
						answers: {
							create: question.answers,
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

		createdQuizzes.push(quiz);
		console.log(`✅ Created quiz: "${quiz.title}" by ${quiz.creator.name}`);
	}

	return createdQuizzes;
}

async function createTestQuizSessions(users: any[], quizzes: any[]) {
	console.log("🔄 Creating test quiz sessions...");

	const sessions = [];

	// Create some SOLO sessions
	for (let i = 0; i < 3; i++) {
		const user = users[i];
		const quiz = quizzes[i];

		const session = await prisma.quizSession.create({
			data: {
				quizId: quiz.id,
				hostId: user.id,
				type: "SOLO",
				isCompleted: Math.random() > 0.5, // Randomly complete some sessions
				startedAt: new Date(
					Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
				), // Random time in last week
				participants: {
					create: {
						userId: user.id,
						score: Math.floor(Math.random() * 100), // Random score 0-100
					},
				},
			},
			include: {
				participants: true,
				quiz: true,
			},
		});

		sessions.push(session);
		console.log(`✅ Created SOLO session for "${session.quiz.title}"`);
	}

	// Create some LIVE sessions with multiple participants
	for (let i = 0; i < 2; i++) {
		const host = users[0];
		const quiz = quizzes[i + 3];
		const joinCode = `TEST${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

		const session = await prisma.quizSession.create({
			data: {
				quizId: quiz.id,
				hostId: host.id,
				type: "LIVE",
				joinCode: joinCode,
				isCompleted: true,
				startedAt: new Date(
					Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000
				), // Random time in last 3 days
				endedAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000), // Ended after start
				participants: {
					create: users.slice(0, 4).map((user) => ({
						userId: user.id,
						score: Math.floor(Math.random() * 100),
					})),
				},
			},
			include: {
				participants: {
					include: {
						user: true,
					},
				},
				quiz: true,
			},
		});

		sessions.push(session);
		console.log(
			`✅ Created LIVE session for "${session.quiz.title}" with ${session.participants.length} participants`
		);
	}

	return sessions;
}

async function main() {
	try {
		console.log("🚀 Starting test data seeding...\n");

		// Create test users
		const users = await createTestUsers();
		console.log(`\n📊 Created ${users.length} test users\n`);

		// Create test quizzes
		const quizzes = await createTestQuizzes(users);
		console.log(`\n📊 Created ${quizzes.length} test quizzes\n`);

		// Create test quiz sessions
		const sessions = await createTestQuizSessions(users, quizzes);
		console.log(`\n📊 Created ${sessions.length} test quiz sessions\n`);

		console.log("✨ Test data seeding completed successfully!");
		console.log("\n📋 Summary:");
		console.log(`   👥 Users: ${users.length}`);
		console.log(`   📝 Quizzes: ${quizzes.length}`);
		console.log(`   🎮 Sessions: ${sessions.length}`);
		console.log(
			`   ❓ Questions: ${quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0)}`
		);
		console.log(
			`   💡 Answers: ${quizzes.reduce((acc, quiz) => acc + quiz.questions.reduce((qacc, q) => qacc + q.answers.length, 0), 0)}`
		);

		console.log("\n🔑 Test User Credentials:");
		testUsers.forEach((user) => {
			console.log(`   📧 ${user.email} | 🔒 ${user.password}`);
		});
	} catch (error) {
		console.error("❌ Error seeding test data:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

if (require.main === module) {
	main().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}

export { main as seedTestData };
