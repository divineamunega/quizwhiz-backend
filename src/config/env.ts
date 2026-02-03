import { AppError } from "@/errors";

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new AppError(`Missing environment variable: ${key}`, 500);
  }
  return value;
};

const nodeEnv = process.env.NODE_ENV ?? "development";

const env = {
  nodeEnv,
  port: Number(process.env.PORT ?? 4000),
  accessTokenSecret: requireEnv("ACCESS_TOKEN_SECRET"),
  accessExpiresIn: requireEnv("ACCESS_EXPIRES_IN"),
  refreshTokenSecret: requireEnv("REFRESH_TOKEN_SECRET"),
  refreshTokenExpiresIn: requireEnv("REFRESH_TOKEN_EXPIRES_IN"),
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  resendApiKey: requireEnv("RESEND_API_KEY"),
  resendDomain: process.env.RESEND_DOMAIN ?? "",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
};

if (Number.isNaN(env.port) || env.port <= 0) {
  throw new AppError("Invalid PORT environment variable.", 500);
}

if (env.nodeEnv === "production" && !env.resendDomain) {
  throw new AppError("Missing RESEND_DOMAIN in production.", 500);
}

export { env };
