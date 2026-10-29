import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    PORT: z.coerce.number().default(3000),
    JWT_SECRET: z.string().min(16),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    UPSTASH_REDIS_REST_URL: z.url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    KAFKA_BROKERS: z.string().default("localhost:9092"),
    KAFKA_CLIENT_ID: z.string().default("url-shortner"),
    KAFKA_GROUP_ID: z.string().default("url-shortner-clicks"),
  },

  clientPrefix: "PUBLIC_",

  client: {},

  runtimeEnv: process.env,

  emptyStringAsUndefined: true,
});
