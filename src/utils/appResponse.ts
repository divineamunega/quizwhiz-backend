// const createSendToken = (user: User, statusCode: number, res: Response) => {
// 	// Create Signed JWT token
// 	const token = signToken(user.id);

// 	// Create an http only cookie to be sent after successfull signin
// 	const cookieOptions = {
// 		expires: new Date(
// 			Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN! * 24 * 60 * 60 * 1000
// 		),
// 		httpOnly: true,
// 		// secure: process.env.ENVIROMENT === "production", // Cookie will be sent only over HTTPS
// 		secure: true, // Cookie will be sent only over HTTPS
// 		sameSite: "none", // Necessary for cross-domain cookies
// 	} as CookieOptions;

// 	res.cookie("jwt", token, cookieOptions);

// 	res.status(statusCode).json({
// 		status: "success",
// 		data: {
// 			user: {
// 				id: user.id,
// 				name: user.name,
// 				email: user.email,
// 			},
// 		},
// 	});
// };
