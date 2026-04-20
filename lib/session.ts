import { randomBytes, createHash, createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "./env";
import { prisma } from "./prisma";

const SESSION_COOKIE_NAME = "upload_imagens_session";
const SESSION_DURATION_IN_SECONDS = 60 * 60 * 24 * 7;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function signToken(token: string) {
  return createHmac("sha256", env.SESSION_SECRET).update(token).digest("hex");
}

function buildCookieValue(token: string) {
  return `${token}.${signToken(token)}`;
}

function readCookieValue(value: string) {
  const [token, signature] = value.split(".");

  if (!token || !signature) {
    return null;
  }

  const expectedSignature = signToken(token);

  if (signature !== expectedSignature) {
    return null;
  }

  return token;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_IN_SECONDS * 1000);

  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, buildCookieValue(token), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawCookie) {
    return null;
  }

  const token = readCookieValue(rawCookie);

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      tokenHash: hashToken(token),
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    return null;
  }

  return session;
}

export async function requireUser() {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function clearSession() {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (rawCookie) {
    const token = readCookieValue(rawCookie);

    if (token) {
      await prisma.session.deleteMany({
        where: {
          tokenHash: hashToken(token),
        },
      });
    }
  }

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
