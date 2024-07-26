import express from "express";
import { Response, Request } from "express";

const app = express();

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
