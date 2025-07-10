import { AsyncErrorHandler } from "@/middlewares";
import { AppError } from "@/errors";

export const check = AsyncErrorHandler(async (req, res) => {
	const user = req.user;

	if (!user) {
		throw new AppError("Unauthorized access. User not found.", 401);
	}

	res.status(200).json({
		status: "success",
		user: {
			name: user.name,
			email: user.email,
			image: user.avatar ?? null,
		},
	});
});
