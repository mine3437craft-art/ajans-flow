import { randomBytes } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { sql } from './db';
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

// Anahtar süreç ömrü boyunca bir kez çözülür.
let onbellek: Uint8Array | null = null;

/**
 * Oturum imzalama anahtarı.
 *
 * 1. `SESSION_SECRET` ortam değişkeni varsa (ve yeterince uzunsa) o kullanılır —
 *    tercih edilen yol budur.
 * 2. Yoksa veritabanında saklanan anahtar kullanılır; ilk çalıştırmada rastgele
 *    üretilip yazılır. Böylece kurulum tek bir eksik değişken yüzünden
 *    tamamen çalışmaz hale gelmez.
 *
 * Veritabanındaki anahtar, şifre özetleriyle aynı güven sınırındadır:
 * veritabanına erişebilen zaten parola özetlerini de görebilir.
 */
async function secretKey(): Promise<Uint8Array> {
  if (onbellek) return onbellek;

  const ortam = process.env.SESSION_SECRET ?? '';
  if (ortam.length >= 32) {
    onbellek = new TextEncoder().encode(ortam);
    return onbellek;
  }

  // ON CONFLICT ... DO UPDATE var olan değeri geri döndürür; böylece aynı anda
  // çalışan iki örnek farklı anahtar üretip birbirinin oturumunu bozmaz.
  const yeni = randomBytes(48).toString('base64');
  const rows = (await sql`
    INSERT INTO app_config (anahtar, deger)
    VALUES ('session_secret', ${yeni})
    ON CONFLICT (anahtar) DO UPDATE SET deger = app_config.deger
    RETURNING deger
  `) as Array<{ deger: string }>;

  const deger = rows[0]?.deger;
  if (!deger) throw new Error('Oturum anahtarı okunamadı.');

  onbellek = new TextEncoder().encode(deger);
  return onbellek;
}

/** Ortam değişkeni mi, veritabanı mı kullanılıyor (teşhis için). */
export function anahtarKaynagi(): 'ortam değişkeni' | 'veritabanı' {
  return (process.env.SESSION_SECRET ?? '').length >= 32 ? 'ortam değişkeni' : 'veritabanı';
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(await secretKey());
}

/** Imzayi dogrular. Gecersiz/suresi dolmus token icin null doner. */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, await secretKey(), { algorithms: ['HS256'] });
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
