import { PrismaClient } from "@prisma/client";

// Node.js globals
declare const process: any;
declare const require: any;
declare const module: any;

const prisma = new PrismaClient();

// Test user emails to identify test data
const testUserEmails = [
	"john.doe@test.com",
	"jane.smith@test.com",
	"mike.johnson@test.com",
	"sarah.wilson@test.com",
	"alex.brown@test.com",
];

async function clearTestData() {
	try {
		console.log("🔄 Starting test data cleanup...\n");

		// Get test users
		const testUsers = await prisma.user.findMany({
			where: {
				email: {
					in: testUserEmails,
				},
			},
		});

		if (testUsers.length === 0) {
			console.log("ℹ️  No test users found. Nothing to clean up.");
			return;
		}

		const testUserIds = testUsers.map((user) => user.id);
		console.log(`🔍 Found ${testUsers.length} test users to clean up`);

		// Get test quizzes created by test users
		const testQuizzes = await prisma.quiz.findMany({
			where: {
				creatorId: {
					in: testUserIds,
				},
			},
		});

		const testQuizIds = testQuizzes.map((quiz) => quiz.id);
		console.log(`🔍 Found ${testQuizzes.length} test quizzes to clean up`);

		// Delete in correct order due to foreign key constraints

		// 1. Delete quiz participants
		if (testQuizIds.length > 0) {
			const deletedParticipants = await prisma.quizParticipant.deleteMany({
				where: {
					OR: [
						{ userId: { in: testUserIds } },
						{ quizSession: { quizId: { in: testQuizIds } } },
					],
				},
			});
			console.log(`🗑️  Deleted ${deletedParticipants.count} quiz participants`);
		}

		// 2. Delete quiz sessions
		if (testQuizIds.length > 0) {
			const deletedSessions = await prisma.quizSession.deleteMany({
				where: {
					OR: [
						{ hostId: { in: testUserIds } },
						{ quizId: { in: testQuizIds } },
					],
				},
			});
			console.log(`🗑️  Deleted ${deletedSessions.count} quiz sessions`);
		}

		// 3. Delete answers
		if (testQuizIds.length > 0) {
			const deletedAnswers = await prisma.answer.deleteMany({
				where: {
					question: {
						quizId: { in: testQuizIds },
					},
				},
			});
			console.log(`🗑️  Deleted ${deletedAnswers.count} answers`);
		}

		// 4. Delete questions
		if (testQuizIds.length > 0) {
			const deletedQuestions = await prisma.question.deleteMany({
				where: {
					quizId: { in: testQuizIds },
				},
			});
			console.log(`🗑️  Deleted ${deletedQuestions.count} questions`);
		}

		// 5. Delete quizzes
		if (testQuizIds.length > 0) {
			const deletedQuizzes = await prisma.quiz.deleteMany({
				where: {
					id: { in: testQuizIds },
				},
			});
			console.log(`🗑️  Deleted ${deletedQuizzes.count} quizzes`);
		}

		// 6. Delete verification codes
		const deletedVerificationCodes = await prisma.verificationCode.deleteMany({
			where: {
				userId: { in: testUserIds },
			},
		});
		console.log(
			`🗑️  Deleted ${deletedVerificationCodes.count} verification codes`
		);

		// 7. Delete refresh tokens
		const deletedRefreshTokens = await prisma.refreshToken.deleteMany({
			where: {
				userId: { in: testUserIds },
			},
		});
		console.log(`🗑️  Deleted ${deletedRefreshTokens.count} refresh tokens`);

		// 8. Finally, delete test users
		const deletedUsers = await prisma.user.deleteMany({
			where: {
				id: { in: testUserIds },
			},
		});
		console.log(`🗑️  Deleted ${deletedUsers.count} test users`);

		console.log("\n✨ Test data cleanup completed successfully!");
	} catch (error) {
		console.error("❌ Error clearing test data:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

async function main() {
	const args = process.argv.slice(2);
	const force = args.includes("--force") || args.includes("-f");

	if (!force) {
		console.log("⚠️  This will delete all test data from the database.");
		console.log("   Run with --force or -f flag to confirm deletion.");
		console.log("   Example: npm run clear-test-data -- --force");
		return;
	}

	await clearTestData();
}

// Check if this script is being run directly
if (typeof require !== "undefined" && require.main === module) {
	main().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}

export { clearTestData };
