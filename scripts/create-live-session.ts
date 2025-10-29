import { PrismaClient } from "@prisma/client";

// Node.js globals
declare const process: any;
declare const require: any;
declare const module: any;

const prisma = new PrismaClient();

async function createLiveSession(
	quizId: string,
	hostEmail: string,
	participantEmails: string[] = []
) {
	try {
		console.log("🔄 Creating live quiz session...");

		// Find the host user
		const host = await prisma.user.findUnique({
			where: { email: hostEmail },
		});

		if (!host) {
			throw new Error(`Host user with email ${hostEmail} not found`);
		}

		// Verify the quiz exists
		const quiz = await prisma.quiz.findUnique({
			where: { id: quizId },
			include: {
				creator: true,
				questions: {
					include: {
						answers: true,
					},
				},
			},
		});

		if (!quiz) {
			throw new Error(`Quiz with ID ${quizId} not found`);
		}

		// Generate a unique join code
		const joinCode = `LIVE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

		// Find participant users
		const participants: any[] = [];
		if (participantEmails.length > 0) {
			const foundParticipants = await prisma.user.findMany({
				where: {
					email: { in: participantEmails },
				},
			});

			if (foundParticipants.length !== participantEmails.length) {
				const foundEmails = foundParticipants.map((p) => p.email);
				const notFound = participantEmails.filter(
					(email) => !foundEmails.includes(email)
				);
				console.warn(
					`⚠️  Warning: Could not find users with emails: ${notFound.join(", ")}`
				);
			}

			participants.push(...foundParticipants);
		}

		// Always include the host as a participant
		if (!participants.find((p) => p.id === host.id)) {
			participants.push(host);
		}

		// Create the live session
		const session = await prisma.quizSession.create({
			data: {
				quizId: quiz.id,
				hostId: host.id,
				type: "LIVE",
				joinCode: joinCode,
				isCompleted: false,
				participants: {
					create: participants.map((participant) => ({
						userId: participant.id,
						score: 0,
					})),
				},
			},
			include: {
				participants: {
					include: {
						user: true,
					},
				},
				quiz: {
					include: {
						creator: true,
						questions: {
							include: {
								answers: true,
							},
						},
					},
				},
				host: true,
			},
		});

		console.log(`✅ Created live session for quiz: "${session.quiz.title}"`);
		console.log(`   🎮 Session ID: ${session.id}`);
		console.log(`   🔑 Join Code: ${session.joinCode}`);
		console.log(`   👤 Host: ${session.host.name} (${session.host.email})`);
		console.log(`   👥 Participants: ${session.participants.length}`);

		session.participants.forEach((participant) => {
			console.log(
				`      • ${participant.user.name} (${participant.user.email})`
			);
		});

		console.log(`   📝 Questions: ${session.quiz.questions.length}`);
		console.log(`   🏷️  Tags: ${session.quiz.tags.join(", ")}`);

		return session;
	} catch (error) {
		console.error("❌ Error creating live session:", error);
		throw error;
	}
}

async function startSession(sessionId: string) {
	try {
		console.log(`🔄 Starting session ${sessionId}...`);

		const session = await prisma.quizSession.update({
			where: { id: sessionId },
			data: {
				startedAt: new Date(),
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

		console.log(`✅ Session started for quiz: "${session.quiz.title}"`);
		console.log(`   ⏰ Started at: ${session.startedAt}`);

		return session;
	} catch (error) {
		console.error("❌ Error starting session:", error);
		throw error;
	}
}

async function endSession(
	sessionId: string,
	finalScores?: { [userId: string]: number }
) {
	try {
		console.log(`🔄 Ending session ${sessionId}...`);

		// Update final scores if provided
		if (finalScores) {
			for (const [userId, score] of Object.entries(finalScores)) {
				await prisma.quizParticipant.updateMany({
					where: {
						quizSessionId: sessionId,
						userId: userId,
					},
					data: {
						score: score,
					},
				});
			}
		}

		const session = await prisma.quizSession.update({
			where: { id: sessionId },
			data: {
				isCompleted: true,
				endedAt: new Date(),
			},
			include: {
				quiz: true,
				host: true,
				participants: {
					include: {
						user: true,
					},
					orderBy: {
						score: "desc",
					},
				},
			},
		});

		console.log(`✅ Session ended for quiz: "${session.quiz.title}"`);
		console.log(`   ⏰ Ended at: ${session.endedAt}`);
		console.log(`   🏆 Final Leaderboard:`);

		session.participants.forEach((participant, index) => {
			const medal =
				index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "  ";
			console.log(
				`      ${medal} ${participant.user.name}: ${participant.score} points`
			);
		});

		return session;
	} catch (error) {
		console.error("❌ Error ending session:", error);
		throw error;
	}
}

async function listActiveQuizzes() {
	const quizzes = await prisma.quiz.findMany({
		where: {
			isDeleted: false,
		},
		include: {
			creator: true,
			questions: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	console.log("📚 Available Quizzes:");
	quizzes.forEach((quiz) => {
		console.log(`   📝 ${quiz.id} - "${quiz.title}" by ${quiz.creator.name}`);
		console.log(
			`      Questions: ${quiz.questions.length} | Tags: ${quiz.tags.join(", ")}`
		);
	});

	return quizzes;
}

async function listTestUsers() {
	const users = await prisma.user.findMany({
		where: {
			email: {
				contains: "@test.com",
			},
		},
		orderBy: {
			name: "asc",
		},
	});

	console.log("👥 Test Users:");
	users.forEach((user) => {
		console.log(`   👤 ${user.email} - ${user.name}`);
	});

	return users;
}

async function main() {
	const args = process.argv.slice(2);
	const command = args[0];

	try {
		switch (command) {
			case "create":
				if (args.length < 3) {
					console.log(
						"📋 Usage: npm run create-session create <quiz-id> <host-email> [participant-emails...]"
					);
					console.log(
						"\n💡 Example: npm run create-session create quiz-123 john.doe@test.com jane.smith@test.com mike.johnson@test.com"
					);
					return;
				}
				const [, quizId, hostEmail, ...participantEmails] = args;
				await createLiveSession(quizId, hostEmail, participantEmails);
				break;

			case "start":
				if (args.length < 2) {
					console.log("📋 Usage: npm run create-session start <session-id>");
					return;
				}
				await startSession(args[1]);
				break;

			case "end":
				if (args.length < 2) {
					console.log("📋 Usage: npm run create-session end <session-id>");
					return;
				}
				await endSession(args[1]);
				break;

			case "list-quizzes":
				await listActiveQuizzes();
				break;

			case "list-users":
				await listTestUsers();
				break;

			default:
				console.log("📋 Available commands:");
				console.log(
					"   create <quiz-id> <host-email> [participant-emails...] - Create a new live session"
				);
				console.log("   start <session-id> - Start an existing session");
				console.log("   end <session-id> - End a session");
				console.log("   list-quizzes - List all available quizzes");
				console.log("   list-users - List all test users");
				console.log("\n💡 Examples:");
				console.log("   npm run create-session list-quizzes");
				console.log("   npm run create-session list-users");
				console.log(
					"   npm run create-session create quiz-123 john.doe@test.com jane.smith@test.com"
				);
		}
	} catch (error) {
		console.error("❌ Command failed:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

if (require.main === module) {
	main();
}

export { createLiveSession, startSession, endSession };
