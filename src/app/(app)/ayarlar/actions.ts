'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { assertAdmin, assertUser, logActivity } from '@/lib/auth';
import { PAGE_KEYS, PAGE_LABELS, type PageKey } from '@/lib/permissions';
import { signSession, sessionCookie } from '@/lib/session';
import type { Role } from '@/lib/types';

const MIN_LENGTH = 8;

function validatePassword(pw: string): string | null {
  if (pw.length < MIN_LENGTH) return `Şifre en az ${MIN_LENGTH} karakter olmalı.`;
  if (!/[a-zçğıöşü]/i.test(pw)) return 'Şifre en az bir harf içermeli.';
  if (!/\d/.test(pw)) return 'Şifre en az bir rakam içermeli.';
  return null;
}

/** Kullanıcının kendi şifresini değiştirmesi. Mevcut şifre doğrulanır. */
export async function changeOwnPassword(_prev: string | null, formData: FormData): Promise<string | null> {
  const user = await assertUser();

  const current = String(formData.get('current') ?? '');
  const next = String(formData.get('next') ?? '');
  const repeat = String(formData.get('repeat') ?? '');

  if (next !== repeat) return 'Yeni şifreler birbiriyle uyuşmuyor.';
  const invalid = validatePassword(next);
  if (invalid) return invalid;

  const rows = (await sql`SELECT password_hash FROM users WHERE id = ${user.id}`) as Array<{
    password_hash: string;
  }>;
  if (!rows[0]) return 'Kullanıcı bulunamadı.';

  if (!(await bcrypt.compare(current, rows[0].password_hash))) {
    return 'Mevcut şifreniz hatalı.';
  }
  if (await bcrypt.compare(next, rows[0].password_hash)) {
    return 'Yeni şifre eskisiyle aynı olamaz.';
  }

  const hash = await bcrypt.hash(next, 12);
  // token_version artar → bu kullanıcının diğer cihazlardaki oturumları düşer.
  const updated = (await sql`
    UPDATE users
    SET password_hash = ${hash}, must_change_password = FALSE, token_version = token_version + 1
    WHERE id = ${user.id}
    RETURNING token_version, username, role
  `) as Array<{ token_version: number; username: string; role: Role }>;

  // Kendi oturumumuz düşmesin diye çerezi yeni sürümle tazeliyoruz.
  const fresh = updated[0];
  const token = await signSession({
    uid: user.id, username: fresh.username, role: fresh.role, tv: fresh.token_version,
  });
  (await cookies()).set(sessionCookie.name, token, sessionCookie.options);

  await logActivity({ userId: user.id, action: 'güncelle', entity: 'şifre', detail: 'kendi şifresini değiştirdi' });
  revalidatePath('/ayarlar');
  return 'ok';
}

/** Yönetici, herhangi bir kullanıcının şifresini sıfırlar. */
export async function resetUserPassword(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = await assertAdmin();

  const userId = parseInt(String(formData.get('user_id') ?? ''), 10);
  const next = String(formData.get('next') ?? '');
  if (!Number.isInteger(userId)) return 'Geçersiz kullanıcı.';

  const invalid = validatePassword(next);
  if (invalid) return invalid;

  const hash = await bcrypt.hash(next, 12);
  // must_change_password = TRUE → kullanıcı ilk girişte kendi şifresini belirler.
  // token_version artar → varsa açık oturumları kapanır.
  const rows = (await sql`
    UPDATE users
    SET password_hash = ${hash}, must_change_password = TRUE, token_version = token_version + 1
    WHERE id = ${userId}
    RETURNING display_name
  `) as Array<{ display_name: string }>;

  if (!rows[0]) return 'Kullanıcı bulunamadı.';

  await logActivity({
    userId: admin.id, action: 'güncelle', entity: 'şifre', entityId: userId,
    detail: `${rows[0].display_name} şifresi sıfırlandı`,
  });
  revalidatePath('/ayarlar');
  return 'ok';
}

export async function createUser(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = await assertAdmin();

  const displayName = String(formData.get('display_name') ?? '').trim();
  const username = String(formData.get('username') ?? '').trim().toLocaleLowerCase('tr-TR');
  const password = String(formData.get('password') ?? '');
  const role = String(formData.get('role') ?? 'staff');

  if (!displayName) return 'Ad Soyad zorunludur.';
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
    return 'Kullanıcı adı 3-30 karakter olmalı; sadece küçük harf, rakam, nokta, tire.';
  }
  if (role !== 'admin' && role !== 'staff') return 'Geçersiz rol.';
  const invalid = validatePassword(password);
  if (invalid) return invalid;

  const exists = (await sql`SELECT 1 FROM users WHERE username = ${username}`) as unknown[];
  if (exists.length > 0) return 'Bu kullanıcı adı zaten kullanılıyor.';

  const hash = await bcrypt.hash(password, 12);
  const rows = (await sql`
    INSERT INTO users (username, display_name, password_hash, role, must_change_password)
    VALUES (${username}, ${displayName}, ${hash}, ${role}, TRUE)
    RETURNING id
  `) as Array<{ id: number }>;

  await logActivity({
    userId: admin.id, action: 'ekle', entity: 'kullanıcı',
    entityId: rows[0]?.id, detail: `${displayName} (${role})`,
  });
  revalidatePath('/ayarlar');
  return 'ok';
}

/** Kullanıcıyı pasife alır / geri açar. Kayıtlar silinmesin diye silme yok. */
export async function toggleUserActive(formData: FormData) {
  const admin = await assertAdmin();
  const userId = parseInt(String(formData.get('user_id') ?? ''), 10);
  if (!Number.isInteger(userId)) throw new Error('Geçersiz kullanıcı.');
  if (userId === admin.id) throw new Error('Kendi hesabınızı kapatamazsınız.');

  const rows = (await sql`
    UPDATE users
    SET is_active = NOT is_active, token_version = token_version + 1
    WHERE id = ${userId}
    RETURNING display_name, is_active
  `) as Array<{ display_name: string; is_active: boolean }>;

  if (!rows[0]) throw new Error('Kullanıcı bulunamadı.');

  await logActivity({
    userId: admin.id, action: 'güncelle', entity: 'kullanıcı', entityId: userId,
    detail: `${rows[0].display_name} ${rows[0].is_active ? 'aktifleştirildi' : 'pasife alındı'}`,
  });
  revalidatePath('/ayarlar');
}

/**
 * Bir "kasa" sayfasına erişimi açar/kapatır. Yönetici için anlamsızdır
 * (zaten her şeyi görür) — yalnızca personele tek tek yetki vermek için.
 */
export async function togglePageAccess(formData: FormData) {
  const admin = await assertAdmin();
  const userId = parseInt(String(formData.get('user_id') ?? ''), 10);
  const pageKey = String(formData.get('page_key') ?? '') as PageKey;

  if (!Number.isInteger(userId)) throw new Error('Geçersiz kullanıcı.');
  if (!PAGE_KEYS.includes(pageKey)) throw new Error('Geçersiz sayfa.');

  const hedef = (await sql`
    SELECT display_name, role FROM users WHERE id = ${userId}
  `) as Array<{ display_name: string; role: string }>;
  if (!hedef[0]) throw new Error('Kullanıcı bulunamadı.');
  if (hedef[0].role === 'admin') throw new Error('Yöneticiye ayrıca yetki vermeye gerek yok.');

  const varMi = (await sql`
    SELECT 1 FROM user_page_access WHERE user_id = ${userId} AND page_key = ${pageKey}
  `) as unknown[];

  if (varMi.length > 0) {
    await sql`DELETE FROM user_page_access WHERE user_id = ${userId} AND page_key = ${pageKey}`;
  } else {
    await sql`
      INSERT INTO user_page_access (user_id, page_key, granted_by)
      VALUES (${userId}, ${pageKey}, ${admin.id})
    `;
  }

  await logActivity({
    userId: admin.id, action: 'güncelle', entity: 'sayfa yetkisi', entityId: userId,
    detail: `${hedef[0].display_name} — ${PAGE_LABELS[pageKey]} ${varMi.length > 0 ? 'kapatıldı' : 'açıldı'}`,
  });
  revalidatePath('/ayarlar');
}
