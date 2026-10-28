import { and, desc, eq, sql } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { redis } from "../../catch/redis";
import { db } from "../../db/db";
import { urlsTable } from "../../db/schema";
import { ERRORS, URL_CACHE } from "../../lib/constant";

const MAX_ATTEMPTS = 5;

type CachedUrl = { shortCode: string; originalUrl: string };

function urlCacheKey(shortCode: string) {
  return `url:${shortCode}`;
}

const SHORT_CODE_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~";

const generateShortCode = customAlphabet(SHORT_CODE_ALPHABET, 10);

export async function createShortUrl(userId: string, originalUrl: string) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const [url] = await db
      .insert(urlsTable)
      .values({
        shortCode: generateShortCode(),
        originalUrl,
        userId,
      })
      .onConflictDoNothing({ target: urlsTable.shortCode })
      .returning();

    if (url) return url;
  }

  throw new Error(ERRORS.SHORT_CODE_GENERATION_FAILED);
}

export async function getUrlByShortCode(shortCode: string) {
  try {
    const cached = await redis.get<CachedUrl>(urlCacheKey(shortCode));
    if (cached) return cached;
  } catch (error) {
    console.error("Redis get failed:", error);
  }

  const [url] = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, shortCode))
    .limit(1);

  if (!url) return null;

  try {
    await redis.set(
      urlCacheKey(shortCode),
      { shortCode: url.shortCode, originalUrl: url.originalUrl },
      { ex: URL_CACHE.TTL_SECONDS },
    );
  } catch (error) {
    console.error("Redis set failed:", error);
  }

  return url;
}

export async function registerClick(shortCode: string) {
  await db
    .update(urlsTable)
    .set({ clicks: sql`${urlsTable.clicks} + 1` })
    .where(eq(urlsTable.shortCode, shortCode));
}

export async function listUrls(userId: string) {
  return db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, userId))
    .orderBy(desc(urlsTable.createdAt));
}

export async function deleteUrl(userId: string, id: string) {
  const [deleted] = await db
    .delete(urlsTable)
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, userId)))
    .returning({ id: urlsTable.id, shortCode: urlsTable.shortCode });

  if (!deleted) return null;

  try {
    await redis.del(urlCacheKey(deleted.shortCode));
  } catch (error) {
    console.error("Redis delete failed:", error);
  }

  return deleted;
}
