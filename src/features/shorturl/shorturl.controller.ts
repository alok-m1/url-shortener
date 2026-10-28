import type { Request, Response } from "express";
import { ERRORS } from "../../lib/constant";
import {
  createUrlSchema,
  shortCodeSchema,
  urlIdSchema,
} from "../../types/shorturl";
import {
  createShortUrl,
  deleteUrl,
  getUrlByShortCode,
  listUrls,
  registerClick,
} from "./shorturl.service";

function toShortUrl(req: Request, shortCode: string) {
  return `${req.protocol}://${req.get("host")}/${shortCode}`;
}

export async function create(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: ERRORS.UNAUTHORIZED });
    return;
  }

  const parsed = createUrlSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: ERRORS.INVALID_INPUT, issues: parsed.error.issues });
    return;
  }

  const url = await createShortUrl(userId, parsed.data.url);
  res.status(201).json({ ...url, shortUrl: toShortUrl(req, url.shortCode) });
}

export async function list(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: ERRORS.UNAUTHORIZED });
    return;
  }

  const urls = await listUrls(userId);
  res.json({
    urls: urls.map((url) => ({
      ...url,
      shortUrl: toShortUrl(req, url.shortCode),
    })),
  });
}

export async function remove(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: ERRORS.UNAUTHORIZED });
    return;
  }

  const parsed = urlIdSchema.safeParse(req.params.id);
  if (!parsed.success) {
    res.status(400).json({ error: ERRORS.INVALID_URL_ID });
    return;
  }

  const deleted = await deleteUrl(userId, parsed.data);
  if (!deleted) {
    res.status(404).json({ error: ERRORS.SHORT_URL_NOT_FOUND });
    return;
  }

  res.status(204).send();
}

export async function redirect(req: Request, res: Response) {
  const parsed = shortCodeSchema.safeParse(req.params.shortCode);
  if (!parsed.success) {
    res.status(404).json({ error: ERRORS.SHORT_URL_NOT_FOUND });
    return;
  }

  const url = await getUrlByShortCode(parsed.data);
  if (!url) {
    res.status(404).json({ error: ERRORS.SHORT_URL_NOT_FOUND });
    return;
  }

  await registerClick(url.shortCode);
  res.redirect(302, url.originalUrl);
}
