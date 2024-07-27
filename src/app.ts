import { Response, Request } from "express";
import express from "express";
import QuizRoute from "./routes/QuizRoutes";

const app = express();
app.use(express.json());

app.use("/api/v1/", QuizRoute);

app.use("*", (req: Request, res: Response) => {
	res.status(404).json({
		status: "fail",
		message: `The ${req.method} request is not available on ${req.originalUrl}`,
	});
});

export default app;

// Create Quizes
// Get Quizes
// Authentication.... (Bare bone Just sign up, login and authorization with protect)
