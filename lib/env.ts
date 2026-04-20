import { z } from "zod";

const isDevelopment = process.env.NODE_ENV !== "production";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(16, "SESSION_SECRET must have at least 16 characters"),
  UPLOAD_DIR: z.string().min(1, "UPLOAD_DIR is required"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse({
  DATABASE_URL:
    process.env.DATABASE_URL ?? (isDevelopment ? "file:./dev.db" : undefined),
  SESSION_SECRET:
    process.env.SESSION_SECRET ??
    (isDevelopment ? "desenvolvimento-apenas-troque-esta-chave" : undefined),
  UPLOAD_DIR: process.env.UPLOAD_DIR ?? "./uploads",
  NODE_ENV: process.env.NODE_ENV,
});
