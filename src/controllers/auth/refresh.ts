import { AppError } from "@/errors";
import { prisma } from "@/lib";
import { AsyncErrorHandler } from "@/middlewares";
import jwt from "jsonwebtoken";
import ms, { StringValue } from "ms";
import { hashToken } from "@/utils";
import { createRefresh } from "@/utils/createRefresh";
import { sendRefreshCookie } from "@/utils/sendRefreshCookie";
import { env } from "@/config/env";

export const refresh = AsyncErrorHandler(async (req, res, next) => {
  const rawRefreshToken = req.cookies["_rt"];

  if (!rawRefreshToken) {
    throw new AppError("Refresh token missing. Please log in again.", 401);
  }

  const hashedRawRefreshToken = hashToken(rawRefreshToken);
  const validToken = await prisma.refreshToken.findUnique({
    where: {
      value: hashedRawRefreshToken,
      expiresAt: { gt: new Date() },
      revoked: false,
    },
  });

  if (!validToken) {
    throw new AppError(
      "Refresh token is invalid or has already been used.",
      401,
    );
  }

  // Token rotation
  const newAccessToken = jwt.sign(
    { id: validToken.userId },
    env.accessTokenSecret,
    {
      expiresIn: env.accessExpiresIn as StringValue,
    },
  );

  const [newRefreshToken, hashedRefreshToken] = createRefresh();

  await prisma.refreshToken.update({
    where: { id: validToken.id },
    data: { revoked: true },
  });

  await prisma.refreshToken.create({
    data: {
      userId: validToken.userId,
      value: hashedRefreshToken,
      expiresAt: new Date(
        Date.now() + ms(env.refreshTokenExpiresIn as StringValue),
      ),
    },
  });

  sendRefreshCookie(res, newRefreshToken);

  res.status(200).json({
    status: "success",
    accessToken: newAccessToken,
  });
});
