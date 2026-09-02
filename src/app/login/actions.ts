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

const MAX_DENEME = 8;

type Row = {
  id: number; username: string; display_name: string;
  password_hash: string; role: Role; is_active: boolean; token_version: number;
};

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const username = String(formData.get('username') ?? '').trim().toLocaleLowerCase('tr-TR');
  const password = String(formData.get('password') ?? '');
  const donus = String(formData.get('donus') ?? '/');

  if (!username || !password) return 'Kullanıcı adı ve şifre gerekli.';

  // --- Deneme sınırı ---
  // Aynı kullanıcı adına 15 dakika içinde 8 başarısız denemeden sonra kilitlenir.
  const [deneme] = (await sql`
    SELECT COUNT(*)::int AS n
    FROM login_attempts
    WHERE username = ${username} AND created_at > NOW() - INTERVAL '15 minutes'
  `) as Array<{ n: number }>;

  if ((deneme?.n ?? 0) >= MAX_DENEME) {
    return 'Çok fazla hatalı deneme yapıldı. 15 dakika sonra tekrar deneyin.';
  }

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
    await sql`INSERT INTO login_attempts (username) VALUES (${username})`;
    const kalan = MAX_DENEME - (deneme?.n ?? 0) - 1;
    return kalan <= 2 && kalan > 0
      ? `Kullanıcı adı veya şifre hatalı. ${kalan} deneme hakkınız kaldı.`
      : 'Kullanıcı adı veya şifre hatalı.';
  }

  // Başarılı giriş: bu kullanıcının sayacı sıfırlanır.
  await sql`DELETE FROM login_attempts WHERE username = ${username}`;

  // Oturum anahtarı eksik/kısaysa signSession hata fırlatır. Bunu çökmeye
  // dönüştürmek yerine ne yapılması gerektiğini söyleyen bir mesaj veriyoruz.
  let token: string;
  try {
    token = await signSession({
      uid: user.id, username: user.username, role: user.role, tv: user.token_version,
    });
  } catch (error) {
    console.error('[login] oturum imzalanamadı:', error instanceof Error ? error.message : error);
    return 'Sunucu ayarı eksik: oturum anahtarı (SESSION_SECRET) tanımlı değil ' +
           'veya 32 karakterden kısa. Yöneticinin bunu düzeltmesi gerekiyor.';
  }
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
