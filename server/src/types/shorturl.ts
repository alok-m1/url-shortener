import { z } from "zod";
import { ERRORS } from "../lib/constant";

export const createUrlSchema = z.object({
  url: z
    .url()
    .max(2048)
    .refine((value) => /^https?:\/\//i.test(value), {
      message: ERRORS.INVALID_URL_PROTOCOL,
    }),
});

export const shortCodeSchema = z.string().trim().min(1).max(10);
export const urlIdSchema = z.uuid();

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
