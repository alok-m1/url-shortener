import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { env } from "../../../env";
import { db } from "../../db/db";
import { usersTable } from "../../db/schema";
import type { LoginInput, RegisterInput } from "../../types/auth";

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function createToken(userId: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  return user ?? null;
}

export async function findUserById(id: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  return user ?? null;
}

export async function registerUser(input: RegisterInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) return null;

  const password = await Bun.password.hash(input.password);
  const [user] = await db
    .insert(usersTable)
    .values({ name: input.name, email: input.email, password })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      createdAt: usersTable.createdAt,
    });

  return user ?? null;
}

export async function loginUser(input: LoginInput) {
  const user = await findUserByEmail(input.email);
  if (!user) return null;

  const valid = await Bun.password.verify(input.password, user.password);
  if (!valid) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}
