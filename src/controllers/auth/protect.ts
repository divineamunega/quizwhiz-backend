import { AuthenticatedRequest } from "@/types";
import { AppError } from "@/errors";
import { prisma } from "@/lib";
import { AsyncErrorHandler } from "@/middlewares";
import { verifyJWT } from "@/utils";
import { env } from "@/config/env";

const protect = AsyncErrorHandler(async function (
  req: AuthenticatedRequest,
  res,
  next,
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return next(
      new AppError("Authorization header missing or malformed.", 401),
    );
  }

  const accessToken = authHeader.split(" ")[1];
  const payload = verifyJWT(accessToken, env.accessTokenSecret) as {
    id: string;
    iat: number;
    exp: number;
  };

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) {
    return next(new AppError("User associated with token not found.", 404));
  }

  req.user = user;
  next();
});

export { protect };
