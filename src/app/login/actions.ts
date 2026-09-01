'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { signSession, sessionCookie } from '@/lib/session';
import type { Role } from '@/lib/types';

// Kullanıcı bulunamadığında da karşılaştırma yapılsın diye geçerli biçimde
// bir kukla hash. Hiçbir şifreyle eşleşmemesi önemli değil; amaç eşit süre.
const DUMMY_HASH = '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

type Row = {
  id: number; username: string; display_name: string;
  password_hash: string; role: Role; is_active: boolean; token_version: number;
};

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const username = String(formData.get('username') ?? '').trim().toLocaleLowerCase('tr-TR');
  const password = String(formData.get('password') ?? '');
  const donus = String(formData.get('donus') ?? '/');

  if (!username || !password) return 'Kullanıcı adı ve şifre gerekli.';

  const rows = (await sql`
    SELECT id, username, display_name, password_hash, role, is_active, token_version
    FROM users WHERE username = ${username}
  `) as Row[];

  const user = rows[0];

  // Kullanıcı yoksa da hash karşılaştırması yapılır: cevap süresinden
  // kullanıcının var olup olmadığı anlaşılmasın.
  const hash = user?.password_hash ?? DUMMY_HASH;
  let ok = false;
  try {
    ok = await bcrypt.compare(password, hash);
  } catch {
    ok = false;
  }

  if (!user || !ok || !user.is_active) {
    return 'Kullanıcı adı veya şifre hatalı.';
  }

  const token = await signSession({
    uid: user.id, username: user.username, role: user.role, tv: user.token_version,
  });
  (await cookies()).set(sessionCookie.name, token, sessionCookie.options);

  await sql`UPDATE users SET last_login_at = NOW() WHERE id = ${user.id}`;
  await sql`
    INSERT INTO activity_log (user_id, action, entity, detail)
    VALUES (${user.id}, 'giriş', 'oturum', ${user.display_name + ' giriş yaptı'})
  `;

  // Açık yönlendirme olmasın diye yalnızca uygulama içi yollara izin verilir.
  const hedef = donus.startsWith('/') && !donus.startsWith('//') ? donus : '/';
  redirect(hedef);
}

export async function logout() {
  (await cookies()).delete(sessionCookie.name);
  redirect('/login');
}
