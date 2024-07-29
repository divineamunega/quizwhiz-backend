import { Response, Request, NextFunction } from "express";
import express from "express";
import QuizRoute from "./routes/QuizRoutes";
import AuthRoute from "./routes/AuthRoutes";
import AppError from "./errors/AppError";
import morgan from "morgan";
import { handleErrorDev, handleErrorProd } from "./errors/ErrorHandlers";
const app = express();
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/v1/quiz", QuizRoute);
app.use("/api/v1/auth", AuthRoute);

app.get("/api/cron", (req: Request, res: Response) => {
	console.log("CRON REQUEST");
	res.status(200).json({
		status: "success",
		message: "Hello to the cronjob.",
	});
});
app.use("*", (req: Request, res: Response) => {
	res.status(404).json({
		status: "fail",
		message: `The ${req.method} request is not available on ${req.originalUrl}`,
	});
});

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
	let formatedErr;

	if (process.env.ENVIROMENT === "PRODUCTION") {
		formatedErr = handleErrorProd(error);
		const { statusCode, ...remainingFormatedErr } = formatedErr;
		res.status(statusCode).json(remainingFormatedErr);
		return;
	}

	if ((process.env.ENVIROMENT = "DEVELOPMENT")) {
		formatedErr = handleErrorDev(error);
		res.status(formatedErr.statusCode || 500).json(formatedErr);
		return;
	}
});
export default app;

// Create Quizes
// Get Quizes
// Authentication.... (Bare bone Just sign up, login and authorization with protect)
