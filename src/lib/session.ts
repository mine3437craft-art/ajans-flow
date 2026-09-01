import { SignJWT, jwtVerify } from 'jose';
import type { Role } from './types';

const COOKIE_NAME = 'af_session';
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 saat

export type SessionPayload = {
  uid: number;
  username: string;
  role: Role;
  /** users.token_version kopyasi - sifre degisince eski cerezler duser. */
  tv: number;
};

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET tanimli degil veya 32 karakterden kisa.');
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

/** Imzayi dogrular. Gecersiz/suresi dolmus token icin null doner. */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] });
    const { uid, username, role, tv } = payload as Record<string, unknown>;
    if (typeof uid !== 'number' || typeof username !== 'string') return null;
    if (role !== 'admin' && role !== 'staff') return null;
    if (typeof tv !== 'number') return null;
    return { uid, username, role, tv };
  } catch {
    return null;
  }
}

export const sessionCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
  options: {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  },
};
