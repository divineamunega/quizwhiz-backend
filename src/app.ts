import { Response, Request, NextFunction } from "express";
import express from "express";
import QuizRoute from "./routes/QuizRoutes";
import AuthRoute from "./routes/AuthRoutes";
import AppError from "./errors/AppError";
import { handleErrorDev, handleErrorProd } from "./errors/ErrorHandlers";
const app = express();
app.use(express.json());

app.use("/api/v1/quiz", QuizRoute);
app.use("/api/v1/auth", AuthRoute);

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
		res.status(formatedErr.statusCode).json(formatedErr);
		return;
	}

	if ((process.env.ENVIROMENT = "DEVELOPMENT")) {
		formatedErr = handleErrorDev(error);
		res.status(formatedErr.statusCode).json(formatedErr);
		return;
	}
});
export default app;

// Create Quizes
// Get Quizes
// Authentication.... (Bare bone Just sign up, login and authorization with protect)
