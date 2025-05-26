# QuizWhizz Backend

This is the backend for the **QuizWhizz** application. It uses:

- **Node.js + Express**
- **PostgreSQL** (via Prisma ORM)
- **Session/Auth with JWT**
- **Beekeeper Studio** for GUI DB access
- **pgAdmin (optional)** for DB admin

---

## ✨ Getting Started (Local Development)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/quizwhizz-backend.git
cd quizwhizz-backend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup your environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Customize the variables inside `.env.local`:

```env
NODE_ENV="development"

DATABASE_PASSWORD=12345678
DATABASE_URL="postgresql://quizwhizz:12345678@localhost:5432/quizwhizz_dev"

ACCESS_TOKEN_SECRET="A_SECRET_PHRASE_FOR_ACCESS_TOKEN"
ACCESS_EXPIRES_IN=10m
REFRESH_TOKEN_SECRET="A_RANDOM_REFRESH_SECRET"
REFRESH_TOKEN_EXPIRES_IN=7d

PORT=3000
```

---

### 4. Create the database & user

Use Beekeeper Studio or `psql` terminal:

```sql
-- Create user
CREATE USER quizwhizz WITH PASSWORD '12345678';

-- Create database
CREATE DATABASE quizwhizz_dev;

-- Grant access
GRANT ALL PRIVILEGES ON DATABASE quizwhizz_dev TO quizwhizz;
```

---

### 5. Run Prisma migrations

```bash
npx prisma migrate dev
```

This sets up your DB schema based on `prisma/schema.prisma`.

---

### 6. Start the dev server

```bash
npm run dev
```

You’ll see:

```
Server running on port 3000 in development.
```

---

## 📊 Accessing the Database

### Option 1: Beekeeper Studio

- Open Beekeeper Studio
- Create a new connection
- Use these credentials:

  - **Host**: `localhost`
  - **Port**: `5432`
  - **Username**: `quizwhizz`
  - **Password**: `12345678`
  - **Database**: `quizwhizz_dev`

### Option 2: Terminal

```bash
psql -U quizwhizz -d quizwhizz_dev -h localhost
```

Once connected:

```sql
\dt   -- List all tables
SELECT * FROM your_table;  -- View data
```

---

## 🧪 Useful Commands

- Run dev server: `npm run dev`
- Build: `npm run build`
- Run production: `npm start`
- Run Prisma Studio: `npx prisma studio`

---

## 👍 .env.example

```env
NODE_ENV="development"

DATABASE_PASSWORD=12345678
DATABASE_URL="postgresql://quizwhizz:12345678@localhost:5432/quizwhizz_dev"

ACCESS_TOKEN_SECRET="A_SECRET_PHRASE_FOR_ACCESS_TOKEN"
ACCESS_EXPIRES_IN=10m
REFRESH_TOKEN_SECRET="A_RANDOM_REFRESH_SECRET"
REFRESH_TOKEN_EXPIRES_IN=7d

PORT=3000
```

---

## 📆 Stack

- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Beekeeper Studio (Recommended)
- pgAdmin (Optional)

---

## ✅ Ready

You're now set up for local development!
