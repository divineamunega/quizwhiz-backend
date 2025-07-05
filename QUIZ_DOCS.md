# 📝 QuizWhiz Quiz API Guide for Frontend Engineers

> ✅ This guide explains how to interact with the QuizWhiz backend API to create, manage, and retrieve quizzes.

---

## 🌍 Backend Base URL

```
https://quizwhiz-backend-1.onrender.com/api/v1
```

## 🌍 Backend Base URL FOR Quiz

```
https://quizwhiz-backend-1.onrender.com/api/v1/quiz
```

---

## 🔐 Authentication

- Most quiz-related endpoints require authentication.
- Send your access token in the `Authorization` header as a `Bearer` token.

```http
Authorization: Bearer <your_access_token>
```

---

## 📘 API Reference

### ✅ Create a New Quiz

- **Endpoint:** `POST /quiz`
- **Method:** `POST`
- **Authentication:** Required

**Request Body:**

```http
POST /quiz
Content-Type: application/json
Authorization: Bearer <accessToken>

{
  "title": "My Awesome Quiz",
  "description": "A quiz about interesting facts.",
  "tags": ["history", "science"]
}
```

**Response (201 Created):**

```json
{
	"status": "success",
	"data": {
		"id": "clxkzf0x30000v9z6jd8h3f2a",
		"title": "My Awesome Quiz",
		"image": null,
		"description": "A quiz about interesting facts.",
		"createdAt": "2025-07-04T14:30:00.000Z",
		"tags": ["history", "science"],
		"visibility": "private"
	}
}
```

---

### ➕ Add a Question to a Quiz

- **Endpoint:** `POST /quiz/:id/question`
- **Method:** `POST`
- **Authentication:** Required

**Request Body:**

```http
POST /quiz/clxkzf0x30000v9z6jd8h3f2a/question
Content-Type: application/json
Authorization: Bearer <accessToken>

{
  "text": "What is the capital of France?",
  "answers": [
    { "text": "Berlin", "isCorrect": false },
    { "text": "Madrid", "isCorrect": false },
    { "text": "Paris", "isCorrect": true },
    { "text": "Rome", "isCorrect": false }
  ]
}
```

**Response (201 Created):**

```json
{
	"status": "success",
	"data": {
		"id": "clxkzf9d40002v9z6k4h2b1c3",
		"quizId": "clxkzf0x30000v9z6jd8h3f2a",
		"text": "What is the capital of France?",
		"answers": [
			{
				"id": "clxkzf9d40003v9z6a7b8c9d0",
				"questionId": "clxkzf9d40002v9z6k4h2b1c3",
				"text": "Berlin",
				"isCorrect": false
			},
			{
				"id": "clxkzf9d40004v9z6e5f4g3h2",
				"questionId": "clxkzf9d40002v9z6k4h2b1c3",
				"text": "Madrid",
				"isCorrect": false
			},
			{
				"id": "clxkzf9d40005v9z6i1j0k9l8",
				"questionId": "clxkzf9d40002v9z6k4h2b1c3",
				"text": "Paris",
				"isCorrect": true
			},
			{
				"id": "clxkzf9d40006v9z6m7n6o5p4",
				"questionId": "clxkzf9d40002v9z6k4h2b1c3",
				"text": "Rome",
				"isCorrect": false
			}
		]
	}
}
```

---

### 📄 Get a Quiz

- **Endpoint:** `GET /quiz/:id`
- **Method:** `GET`
- **Authentication:** Not Required

**Request:**

```http
GET /quiz/clxkzf0x30000v9z6jd8h3f2a
```

**Response (200 OK):**

```json
{
	"status": "success",
	"data": {
		"id": "clxkzf0x30000v9z6jd8h3f2a",
		"title": "My Awesome Quiz",
		"image": null,
		"description": "A quiz about interesting facts.",
		"createdAt": "2025-07-04T14:30:00.000Z",
		"tags": ["history", "science"],
		"visibility": "private"
	}
}
```

**Response (404 Not Found):**

```json
{
	"status": "fail",
	"message": "Quiz with that ID not found"
}
```

---

### 🗑️ Delete a Quiz

- **Endpoint:** `DELETE /quiz/:id`
- **Method:** `DELETE`
- **Authentication:** Required

**Request:**

```http
DELETE /quiz/clxkzf0x30000v9z6jd8h3f2a
Authorization: Bearer <accessToken>
```

**Response (204 No Content):**

The server will respond with a `204 No Content` status code if the quiz is successfully deleted.

**Response (404 Not Found):**

```json
{
	"status": "fail",
	"message": "Quiz not found"
}
```
