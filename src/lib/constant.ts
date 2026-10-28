export const AUTH_COOKIE = {
  NAME: "token",
  MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000,
} as const;

export const URL_CACHE = {
  TTL_SECONDS: 60 * 60 * 24,
} as const;

export const ERRORS = {
  INVALID_INPUT: "Invalid input",
  INVALID_URL_PROTOCOL: "Only http and https URLs are supported",
  EMAIL_ALREADY_REGISTERED: "Email already registered",
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "Unauthorized",
  USER_NOT_FOUND: "User not found",
  SHORT_URL_NOT_FOUND: "Short URL not found",
  INVALID_URL_ID: "Invalid url id",
  NOT_FOUND: "Not found",
  INTERNAL_SERVER_ERROR: "Internal server error",
  SHORT_CODE_GENERATION_FAILED: "Could not generate a unique short code",
} as const;
