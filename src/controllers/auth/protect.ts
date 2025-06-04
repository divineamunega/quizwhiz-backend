// import { AppError } from "@/errors";
// import { AsyncErrorHandler } from "@/middlewares";
// import jwt from "jsonwebtoken";

// const protect = AsyncErrorHandler(async function (req, res, next) {
// 	const bearerString = req.headers["authorization"]?.split(" ");

// 	if (bearerString?.at(0) !== "Bearer" || !bearerString.at(1))
// 		return next(new AppError("Wrong Credentials", 401));

// 	const accessToken = bearerString.at(1);

// 	const payload = jwt.verify(accessToken);
// });
