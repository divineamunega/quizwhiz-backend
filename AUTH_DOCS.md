# 🔐 QuizWhizz Authentication Guide for Frontend Engineers

> ✅ This guide explains how to authenticate users with the QuizWhizz backend API using **Axios**, **React Query**, and **cookies** securely.

---

## 🌍 Backend Base URL

```
https://quizwhiz-backend-1.onrender.com
```

---

---

## 🌍 Backend Base URL for auth

```
https://quizwhiz-backend-1.onrender.com/api/v1/auth
```

---

## 📦 Stack Assumptions

- **Frontend**: React + Axios + React Query
- **Cookies**: Used to store refresh tokens (as `HttpOnly`)
- **Access Token**: Sent in Authorization headers (`Bearer ...`)
- **Refresh Token**: Automatically handled by cookie from backend
- **Login Flow**: Email & password form
- **Signup Flow**: Email, name & password
- **Email Verification**: 6-digit code

---

## 🔐 Auth Flow Overview

### 1. **Signup**

- `POST /signup`
- On success: access token in response, refresh token in cookie

### 2. **Login**

- `POST /login`
- On success: access token in response, refresh token in cookie

### 3. **Refresh Token**

- `GET /refresh`
- On success: new access token in response, new refresh token in cookie

### 4. **Protected Routes**

- Send access token in `Authorization: Bearer ...` header

### 5. **Email Verification**

- `GET /verify_email?code=abc123`
- Requires user to be authenticated (use access token)

### 6. **Resend Email Verification**

- `GET /resend-verfication`
- Requires user to be authenticated (use access token)

---

## 🧠 Important Notes

- `Access Token` is short-lived. Store in memory (NOT in localStorage).
- `Refresh Token` is stored in an **`HttpOnly cookie`** — **you cannot access it from JS.**
- **Always send credentials (cookies)** with Axios by using:

  ```js
  axios.defaults.withCredentials = true;
  ```

---

## 📘 API Reference

### ✅ Signup

```http
POST /signup
Content-Type: application/json

{
  "name": "Divine",
  "email": "divine@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
	"message": "success",
	"accessToken": "<JWT>",
	"user": {
		"id": "...",
		"name": "...",
		"email": "...",
		"avatar": null
	}
}
```

---

### 🔐 Login

```http
POST /login
Content-Type: application/json

{
  "email": "divine@example.com",
  "password": "securepassword"
}
```

**Response:**
Same as signup.

---

### 🔁 Refresh Access Token

```http
GET /refresh
```

- Automatically checks the `HttpOnly` refresh token cookie.
- Returns a new access token.

**Response:**

```json
{
	"status": "success",
	"data": {
		"accessToken": "<JWT>"
	}
}
```

---

### 📩 Verify Email

```http
GET /verify_email?code=abc123
Authorization: Bearer <accessToken>
```

---

### 🔁 Resend Verification Email

```http
GET /resend-verfication
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
	"message": "Verification Code Sent successfully"
}
```

---

### 🔒 Access Protected Routes

```http
GET /profile
Authorization: Bearer <accessToken>
```

---

## ⚙️ React Setup

### 🔧 Axios Config

```ts
// axios.ts
import axios from "axios";

const api = axios.create({
	baseURL: "https://quizwhiz-backend-1.onrender.com/api/v1",
	withCredentials: true, // very important for cookies
});

export default api;
```

---

### 📦 React Query: Login Mutation

```tsx
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useLogin = () => {
	return useMutation({
		mutationFn: (data) => api.post("/auth/login", data),
		onSuccess: (res) => {
			// Save access token in memory (not localStorage)
			const token = res.data.accessToken;
			// Example: save in global store or context
		},
	});
};
```

---

### 🔁 Refresh Token on Access Token Expiry

1. Intercept 401 errors
2. Call `/auth/refresh`
3. Retry the original request with new access token

Example Axios interceptor (optional advanced):

```ts
api.interceptors.response.use(
	(res) => res,
	async (err) => {
		if (err.response?.status === 401) {
			try {
				const refreshRes = await api.get("/auth/refresh");
				const newToken = refreshRes.data.data.accessToken;
				// update your token store

				// retry original request
				err.config.headers.Authorization = `Bearer ${newToken}`;
				return api(err.config);
			} catch (refreshErr) {
				// logout user
			}
		}
		return Promise.reject(err);
	}
);
```

---

### 🔐 Sending Authenticated Requests

```ts
const fetchUser = async () => {
	const accessToken = getFromStore(); // memory or context
	return api.get("/user/me", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
};
```

---

## 🧪 Testing Locally

If frontend is at `http://localhost:5173`, CORS config on backend already allows it.

```ts
// Frontend requests must always set:
withCredentials: true;
```

---

## 🛑 Common Pitfalls

| Issue                    | Fix                                                         |
| ------------------------ | ----------------------------------------------------------- |
| `401 Unauthorized`       | Ensure you're sending valid access token                    |
| Refresh not working      | Check that cookies are sent (`withCredentials: true`)       |
| Can't read refresh token | You **can't** – it's `HttpOnly` on purpose                  |
| CORS errors              | Use correct origin (`localhost:5173`) and credentials setup |

---

## ✅ Final Checklist

- [x] Send `withCredentials: true`
- [x] Store access token in memory
- [x] Use `Authorization: Bearer ...` header
- [x] Use React Query mutations/queries for auth
- [x] Automatically refresh tokens on expiry (optional)

---
