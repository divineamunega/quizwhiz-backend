# QuizWhiz Test Data Scripts

This directory contains scripts to generate and manage test data for the QuizWhiz application. These scripts help you quickly populate your development database with realistic test data.

## Available Scripts

### 1. Seed Test Data (`seed-test-data.ts`)

Creates a complete set of test data including users, quizzes, questions, answers, and quiz sessions.

```bash
npm run seed-test-data
```

**What it creates:**

- 5 test users with verified emails
- 5 diverse quizzes (JavaScript, React, General Knowledge, Math, Science)
- Multiple questions per quiz with 4 answer options each
- Solo and live quiz sessions with participants and scores

**Test User Credentials:**

- `john.doe@test.com` / `password123`
- `jane.smith@test.com` / `password123`
- `mike.johnson@test.com` / `password123`
- `sarah.wilson@test.com` / `password123`
- `alex.brown@test.com` / `password123`

### 2. Clear Test Data (`clear-test-data.ts`)

Safely removes all test data from the database.

```bash
npm run clear-test-data -- --force
```

**Safety Features:**

- Requires `--force` flag to prevent accidental deletion
- Only removes data associated with test users
- Handles foreign key constraints properly
- Provides detailed deletion summary

### 3. Generate Sample Quiz (`generate-sample-quiz.ts`)

Creates individual quizzes from predefined templates.

```bash
npm run generate-quiz <category> <creator-email>
```

**Available Categories:**

- `programming` - Programming fundamentals
- `history` - World history events
- `science` - Physics, chemistry, biology
- `geography` - Countries, capitals, landmarks
- `sports` - Sports trivia and facts

**Example:**

```bash
npm run generate-quiz programming john.doe@test.com
npm run generate-quiz history jane.smith@test.com
```

### 4. Create Live Session (`create-live-session.ts`)

Manages live quiz sessions for testing multiplayer functionality.

```bash
# List available quizzes
npm run create-session list-quizzes

# List test users
npm run create-session list-users

# Create a live session
npm run create-session create <quiz-id> <host-email> [participant-emails...]

# Start a session
npm run create-session start <session-id>

# End a session
npm run create-session end <session-id>
```

**Examples:**

```bash
# List available resources
npm run create-session list-quizzes
npm run create-session list-users

# Create a live session with multiple participants
npm run create-session create quiz-123 john.doe@test.com jane.smith@test.com mike.johnson@test.com

# Start the session
npm run create-session start session-456

# End the session
npm run create-session end session-456
```

## Quick Start Guide

1. **Set up your development environment:**

   ```bash
   cd quizwhiz-backend
   npm install
   npm run prisma:generate
   npm run migrate:dev
   ```

2. **Create test data:**

   ```bash
   npm run seed-test-data
   ```

3. **Start your development server:**

   ```bash
   npm run dev
   ```

4. **Test with the created users:**
   - Login with any test user credentials
   - Browse the created quizzes
   - Join live sessions using the generated join codes

## Development Workflow

### Daily Development

```bash
# Start fresh each day
npm run clear-test-data -- --force
npm run seed-test-data
npm run dev
```

### Testing Specific Features

**Quiz Creation:**

```bash
npm run generate-quiz programming john.doe@test.com
npm run generate-quiz science jane.smith@test.com
```

**Live Sessions:**

```bash
# Create a session
npm run create-session create <quiz-id> john.doe@test.com jane.smith@test.com

# Test the session flow
npm run create-session start <session-id>
# ... test your live quiz functionality ...
npm run create-session end <session-id>
```

**User Authentication:**

- Use any test user email with password `password123`
- All test users have verified emails

## Data Structure

### Test Users

Each test user includes:

- Unique email and name
- Hashed password (`password123`)
- Verified email status
- Avatar image from DiceBear API

### Test Quizzes

Each quiz includes:

- Title and description
- Relevant tags
- Public/private visibility
- Cover image from Unsplash
- 2-3 questions with 4 answers each
- Proper question and answer positioning

### Quiz Sessions

- Solo sessions with individual scores
- Live sessions with multiple participants
- Realistic timestamps and completion status
- Join codes for live sessions

## Troubleshooting

### Common Issues

**Database Connection Errors:**

- Ensure your `.env.local` file has correct `DATABASE_URL`
- Check if your database is running
- Verify Prisma client is generated: `npm run prisma:generate`

**Foreign Key Constraint Errors:**

- Use the clear script before seeding: `npm run clear-test-data -- --force`
- Ensure you're running migrations: `npm run migrate:dev`

**User Not Found Errors:**

- Run `npm run seed-test-data` first to create test users
- Check user emails match exactly (case-sensitive)

### Reset Everything

```bash
npm run clear-test-data -- --force
npm run migrate:dev
npm run seed-test-data
```

## Script Architecture

All scripts use:

- **Prisma Client** for database operations
- **TypeScript** for type safety
- **Proper error handling** with detailed logging
- **Transactional operations** where appropriate
- **Colored console output** for better readability

The scripts are designed to be:

- **Idempotent** - Safe to run multiple times
- **Atomic** - Either complete successfully or fail cleanly
- **Informative** - Provide detailed feedback on operations
- **Flexible** - Accept parameters for customization

## Contributing

When adding new test data scripts:

1. Follow the existing TypeScript patterns
2. Include proper error handling and logging
3. Add corresponding npm script to `package.json`
4. Update this README with usage instructions
5. Test with both success and failure scenarios

## Environment Variables

Scripts use the same environment variables as the main application:

- `DATABASE_URL` - PostgreSQL connection string
- Loaded from `.env.local` for development

Make sure your `.env.local` file is properly configured before running any scripts.
