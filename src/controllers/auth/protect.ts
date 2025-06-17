import { AppError } from "@/errors";
import { AsyncErrorHandler } from "@/middlewares";
import jwt from "jsonwebtoken";

const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const accessExpiresIn = process.env.ACCESS_EXPIRES_IN;

if (!accessSecret) {
	throw new AppError("Invalid Enviroment Credentials", 500);
}

const protect = AsyncErrorHandler(async function (req, res, next) {
	const bearerString = req.headers["authorization"]?.split(" ");

	if (bearerString?.at(0) !== "Bearer" || !bearerString.at(1))
		return next(new AppError("Wrong Credentials", 401));

	const accessToken = bearerString.at(1);

	if (!accessToken) throw new AppError("Invalid Credentials", 400); // correct error codes and errors

	const payload = jwt.verify(accessToken, accessSecret);
	console.log(payload);
	return;
});

export { protect };
