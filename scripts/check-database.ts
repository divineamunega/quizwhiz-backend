import { PrismaClient } from "@prisma/client";

// Node.js globals
declare const process: any;
declare const require: any;
declare const module: any;

const prisma = new PrismaClient();

async function checkDatabase() {
	try {
		console.log("🔍 Checking database state...\n");

		// Count all entities
		const [
			userCount,
			quizCount,
			questionCount,
			answerCount,
			sessionCount,
			participantCount,
			refreshTokenCount,
			verificationCodeCount,
		] = await Promise.all([
			prisma.user.count(),
			prisma.quiz.count(),
			prisma.question.count(),
			prisma.answer.count(),
			prisma.quizSession.count(),
			prisma.quizParticipant.count(),
			prisma.refreshToken.count(),
			prisma.verificationCode.count(),
		]);

		console.log("📊 Database Overview:");
		console.log(`   � PUsers: ${userCount}`);
		console.log(`   � Quizzes : ${quizCount}`);
		console.log(`   ❓ Questions: ${questionCount}`);
		console.log(`   💡 Answers: ${answerCount}`);
		console.log(`   🎮 Quiz Sessions: ${sessionCount}`);
		console.log(`   👤 Participants: ${participantCount}`);
		console.log(`   🔑 Refresh Tokens: ${refreshTokenCount}`);
		console.log(`   📧 Verification Codes: ${verificationCodeCount}`);

		// Check for test data
		const testUsers = await prisma.user.findMany({
			where: {
				email: {
					contains: "@test.com",
				},
			},
		});

		console.log(`\n🧪 Test Data:`);
		console.log(`   Test Users: ${testUsers.length}`);

		if (testUsers.length > 0) {
			console.log("\n👥 Test Users:");
			testUsers.forEach((user) => {
				console.log(
					`   • ${user.name} (${user.email}) - Verified: ${user.emailVerified ? "✅" : "❌"}`
				);
			});

			// Get quizzes created by test users
			const testQuizzes = await prisma.quiz.findMany({
				where: {
					creatorId: {
						in: testUsers.map((u) => u.id),
					},
				},
				include: {
					creator: true,
					questions: true,
				},
			});

			if (testQuizzes.length > 0) {
				console.log("\n📝 Test Quizzes:");
				testQuizzes.forEach((quiz) => {
					console.log(`   • "${quiz.title}" by ${quiz.creator.name}`);
					console.log(
						`     Questions: ${quiz.questions.length} | Tags: ${quiz.tags.join(", ")}`
					);
				});
			}

			// Get active sessions
			const activeSessions = await prisma.quizSession.findMany({
				where: {
					isCompleted: false,
				},
				include: {
					quiz: true,
					host: true,
					participants: {
						include: {
							user: true,
						},
					},
				},
			});

			if (activeSessions.length > 0) {
				console.log("\n🎮 Active Sessions:");
				activeSessions.forEach((session) => {
					console.log(
						`   • "${session.quiz.title}" hosted by ${session.host.name}`
					);
					console.log(
						`     Type: ${session.type} | Participants: ${session.participants.length}`
					);
					if (session.joinCode) {
						console.log(`     Join Code: ${session.joinCode}`);
					}
				});
			}

			// Get recent completed sessions
			const recentSessions = await prisma.quizSession.findMany({
				where: {
					isCompleted: true,
				},
				include: {
					quiz: true,
					host: true,
					participants: {
						include: {
							user: true,
						},
					},
				},
				orderBy: {
					endedAt: "desc",
				},
				take: 5,
			});

			if (recentSessions.length > 0) {
				console.log("\n🏁 Recent Completed Sessions:");
				recentSessions.forEach((session) => {
					console.log(
						`   • "${session.quiz.title}" hosted by ${session.host.name}`
					);
					console.log(
						`     Completed: ${session.endedAt?.toLocaleDateString()} | Participants: ${session.participants.length}`
					);

					// Show top scorer
					if (session.participants.length > 0) {
						const topScorer = session.participants.reduce((prev, current) =>
							(prev.score || 0) > (current.score || 0) ? prev : current
						);
						if (topScorer.score !== null) {
							console.log(
								`     Top Score: ${topScorer.user.name} with ${topScorer.score} points`
							);
						}
					}
				});
			}
		} else {
			console.log(
				'\n💡 No test data found. Run "npm run seed-test-data" to create test data.'
			);
		}

		// Check database health
		console.log("\n🏥 Database Health:");

		// Check for orphaned records (questions without valid quiz references)
		const allQuizIds = await prisma.quiz.findMany({ select: { id: true } });
		const validQuizIds = allQuizIds.map((q) => q.id);

		const orphanedQuestions =
			validQuizIds.length > 0
				? await prisma.question.count({
						where: {
							quizId: {
								notIn: validQuizIds,
							},
						},
					})
				: await prisma.question.count();

		// Check for orphaned answers (answers without valid question references)
		const allQuestionIds = await prisma.question.findMany({
			select: { id: true },
		});
		const validQuestionIds = allQuestionIds.map((q) => q.id);

		const orphanedAnswers =
			validQuestionIds.length > 0
				? await prisma.answer.count({
						where: {
							questionId: {
								notIn: validQuestionIds,
							},
						},
					})
				: await prisma.answer.count();

		if (orphanedQuestions > 0 || orphanedAnswers > 0) {
			console.log(
				`   ⚠️  Found ${orphanedQuestions} orphaned questions and ${orphanedAnswers} orphaned answers`
			);
		} else {
			console.log("   ✅ No orphaned records found");
		}

		// Check for users without verified emails
		const unverifiedUsers = await prisma.user.count({
			where: {
				emailVerified: false,
				googleVerified: false,
			},
		});

		if (unverifiedUsers > 0) {
			console.log(`   ⚠️  ${unverifiedUsers} users with unverified emails`);
		} else {
			console.log("   ✅ All users have verified emails");
		}

		// Check for expired verification codes
		const expiredCodes = await prisma.verificationCode.count({
			where: {
				expiresAt: {
					lt: new Date(),
				},
				isUsed: false,
			},
		});

		if (expiredCodes > 0) {
			console.log(`   ⚠️  ${expiredCodes} expired verification codes found`);
		} else {
			console.log("   ✅ No expired verification codes");
		}

		// Check for expired refresh tokens
		const expiredTokens = await prisma.refreshToken.count({
			where: {
				expiresAt: {
					lt: new Date(),
				},
				revoked: false,
			},
		});

		if (expiredTokens > 0) {
			console.log(`   ⚠️  ${expiredTokens} expired refresh tokens found`);
		} else {
			console.log("   ✅ No expired refresh tokens");
		}

		// Database statistics
		console.log("\n📈 Database Statistics:");

		// Average questions per quiz
		if (quizCount > 0) {
			const avgQuestions = (questionCount / quizCount).toFixed(1);
			console.log(`   📊 Average questions per quiz: ${avgQuestions}`);
		}

		// Average answers per question
		if (questionCount > 0) {
			const avgAnswers = (answerCount / questionCount).toFixed(1);
			console.log(`   📊 Average answers per question: ${avgAnswers}`);
		}

		// Session completion rate
		if (sessionCount > 0) {
			const completedSessions = await prisma.quizSession.count({
				where: { isCompleted: true },
			});
			const completionRate = ((completedSessions / sessionCount) * 100).toFixed(
				1
			);
			console.log(`   📊 Session completion rate: ${completionRate}%`);
		}

		// Most popular quiz tags
		const allQuizzes = await prisma.quiz.findMany({
			select: { tags: true },
		});

		if (allQuizzes.length > 0) {
			const tagCounts: { [key: string]: number } = {};
			allQuizzes.forEach((quiz) => {
				quiz.tags.forEach((tag) => {
					tagCounts[tag] = (tagCounts[tag] || 0) + 1;
				});
			});

			const sortedTags = Object.entries(tagCounts)
				.sort(([, a], [, b]) => b - a)
				.slice(0, 5);

			if (sortedTags.length > 0) {
				console.log("   🏷️  Top quiz tags:");
				sortedTags.forEach(([tag, count]) => {
					console.log(`      • ${tag}: ${count} quizzes`);
				});
			}
		}

		console.log("\n✨ Database check completed!");
	} catch (error) {
		console.error("❌ Error checking database:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

async function main() {
	const args = process.argv.slice(2);

	if (args.includes("--help") || args.includes("-h")) {
		console.log("📋 Database Check Tool");
		console.log("\nUsage: npm run check-db");
		console.log(
			"\nThis tool provides an overview of your database state including:"
		);
		console.log("• Entity counts (users, quizzes, questions, etc.)");
		console.log("• Test data summary");
		console.log("• Active and recent quiz sessions");
		console.log("• Database health checks");
		console.log("• Database statistics and insights");
		return;
	}

	await checkDatabase();
}

// Check if this script is being run directly
if (typeof require !== "undefined" && require.main === module) {
	main().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}

export { checkDatabase };
