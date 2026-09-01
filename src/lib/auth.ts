import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sql } from './db';
import { sessionCookie, verifySession } from './session';
import type { SessionUser } from './types';

/**
 * Çerezdeki oturumu doğrular ve kullanıcıyı VERİTABANINDAN tazeler.
 * Rol her istekte veritabanından okunur — çerezdeki role güvenilmez.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(sessionCookie.name)?.value;
  if (!token) return null;

  const payload = await verifySession(token);
  if (!payload) return null;

  const rows = (await sql`
    SELECT id, username, display_name, role, must_change_password, token_version, is_active
    FROM users WHERE id = ${payload.uid}
  `) as Array<SessionUser & { token_version: number; is_active: boolean }>;

  const user = rows[0];
  if (!user || !user.is_active) return null;
  // Şifre değiştiyse token_version artmıştır; eski çerez geçersiz.
  if (user.token_version !== payload.tv) return null;

  return {
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    role: user.role,
    must_change_password: user.must_change_password,
  };
}

/**
 * Oturum yoksa /login'e yollar. Şifre değiştirme zorunluluğunu KONTROL ETMEZ —
 * kabuk layout'u ve /ayarlar bunu kullanır, aksi halde sonsuz yönlendirme olur.
 */
export async function requireSession(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

/** Korumalı sayfaların ilk satırı: oturum + ilk girişte şifre değiştirme zorunluluğu. */
export async function requireUser(): Promise<SessionUser> {
  const user = await requireSession();
  if (user.must_change_password) redirect('/ayarlar?ilk=1');
  return user;
}

/**
 * Yönetici dışındaki herkesi panoya geri yollar.
 * Finans içeren HER sayfa ve HER server action bunu çağırmak zorunda —
 * menüyü gizlemek tek başına koruma değildir.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/?yetkisiz=1');
  return user;
}

/** Server action'lar için: yönlendirme yerine hata fırlatır. */
export async function assertAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Oturum bulunamadı.');
  if (user.role !== 'admin') throw new Error('Bu işlem için yetkiniz yok.');
  return user;
}

export async function assertUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Oturum bulunamadı.');
  return user;
}

export async function logActivity(opts: {
  userId: number;
  action: string;
  entity: string;
  entityId?: number | null;
  detail?: string;
  isFinancial?: boolean;
}) {
  await sql`
    INSERT INTO activity_log (user_id, action, entity, entity_id, detail, is_financial)
    VALUES (${opts.userId}, ${opts.action}, ${opts.entity},
            ${opts.entityId ?? null}, ${opts.detail ?? null}, ${opts.isFinancial ?? false})
  `;
}
