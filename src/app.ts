import { Response, Request, NextFunction } from "express";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

import { authRouter } from "@/routes";
import { quizRouter } from "@/routes";
import { AppError } from "@/errors";
import { handleErrorDev, handleErrorProd } from "@/errors";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(morgan("tiny"));
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
		optionsSuccessStatus: 200,
		methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
	})
);
app.options(
	"*",
	cors({
		origin: "http://localhost:5173",
		credentials: true,
		optionsSuccessStatus: 200,
		methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
	})
);

app.use(
	session({
		secret: process.env.SESSION_SECRET + "",
		resave: false,
		saveUninitialized: true,
	})
);

/**
 *  Routes
 */
app.use("/api/v1/quiz", quizRouter);
app.use("/api/v1/auth", authRouter);

/**
 * Wildcard for unkown routes
 *  */
app.use("*", (req: Request, res: Response) => {
	res.status(404).json({
		status: "fail",
		message: `The ${req.method} request is not available on ${req.originalUrl}`,
	});
});

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
	let formatedErr;

	if (process.env.NODE_ENV === "production") {
		formatedErr = handleErrorProd(error);
		const { statusCode, ...remainingFormatedErr } = formatedErr;
		res.status(statusCode).json(remainingFormatedErr);
		return;
	}

	if (process.env.NODE_ENV === "development") {
		console.log(error);
		formatedErr = handleErrorDev(error);
		res.status(formatedErr.statusCode || 500).json(formatedErr);
		return;
	}

	// Fallback for other NODE_ENV values (test, staging, etc)
	res.status(500).json({
		status: "error",
		message: "Unexpected environment. Internal server error.",
	});
});
export default app;
