import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser, getPageAccess } from '@/lib/auth';
import { sql } from '@/lib/db';
import { markaBul, DURUM_HARITA, ACIK_DURUMLAR, EK_ALANLAR, gecerliDurum, bugun } from '@/lib/adaylar';
import { aramaDesenleri } from '@/lib/arama';
import { telefonCoz } from '@/lib/telefon';

/**
 * Listeyi Excel'de açılacak CSV olarak indirir.
 *
 * - Yalnızca yönetici: aday listesi şirketin en kolay taşınabilir verisi.
 * - UTF-8 BOM + noktalı virgül + CRLF: Türkçe Excel tek sütuna yığmasın,
 *   Türkçe harfler bozulmasın.
 * - "=", "+", "-", "@" ile başlayan hücrelerin başına tırnak konur; aksi
 *   halde Excel bunları formül olarak çalıştırır (CSV formül enjeksiyonu).
 * - Telefon boşluklu yazılır ki Excel baştaki 0'ı atmasın.
 */

function hucre(v: unknown): string {
  if (v === null || v === undefined) return '';
  let s = String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function tarihTR(v: string | null): string {
  if (!v) return '';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Istanbul',
  }).format(d);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ marka: string }> },
) {
  const { marka: yol } = await params;
  const marka = markaBul(yol);
  if (!marka) return new NextResponse('Bulunamadı', { status: 404 });

  const user = await getCurrentUser();
  if (!user) return new NextResponse('Oturum gerekli', { status: 401 });

  // Liste yetkisi olmayan hiç göremez; dışa aktarma ayrıca yalnızca yönetici.
  const erisim = user.role === 'admin' || (await getPageAccess(user.id)).has(marka.izin);
  if (!erisim) return new NextResponse('Yetkiniz yok', { status: 403 });
  if (user.role !== 'admin') {
    return new NextResponse('Excel’e aktarma yalnızca yöneticide.', { status: 403 });
  }

  const sp = request.nextUrl.searchParams;
  const arama = (sp.get('ara') ?? '').trim();
  const durumFiltre = sp.get('durum') ?? 'acik';
  const sorumluFiltre = sp.get('sorumlu') ?? '';
  const webFiltre = sp.get('web') ?? '';
  const gorunum = sp.get('gorunum') ?? '';
  const ajansFiltre = sp.get('ajans') ?? '';

  const desenler = aramaDesenleri(arama);
  const rakamlar = arama.replace(/\D/g, '').replace(/^0+/, '').replace(/^90/, '');
  const numaraArama = rakamlar.length >= 3 ? rakamlar : null;
  const tekDurum = gecerliDurum(durumFiltre) ? durumFiltre : null;
  const sadeceAcik = durumFiltre === 'acik';
  const sorumluId = /^\d+$/.test(sorumluFiltre) ? parseInt(sorumluFiltre, 10) : null;

  const satirlar = (await sql`
    SELECT p.name, p.contact_person, p.phone_raw, p.status, p.next_call_on,
           p.city, p.source, p.link, p.last_note, p.call_count, p.unreached_streak,
           p.has_website, p.worked_with_agency, p.last_call_at, p.created_at,
           s.display_name AS sorumlu, a.display_name AS son_arayan
    FROM prospects p
    LEFT JOIN users s ON s.id = p.assigned_to
    LEFT JOIN users a ON a.id = p.last_call_by
    WHERE p.brand = ${marka.anahtar}
      AND (${sadeceAcik}::boolean = FALSE OR p.status = ANY(${ACIK_DURUMLAR}::text[]))
      AND (${tekDurum}::text IS NULL OR p.status = ${tekDurum}::text)
      AND (${gorunum}::text <> 'bugun' OR (
            p.status = ANY(${ACIK_DURUMLAR}::text[])
            AND (p.next_call_on <= ${bugun()}::date OR p.status = 'aranmadi')))
      AND (${sorumluFiltre}::text = '' OR
           (${sorumluFiltre} = 'ben' AND p.assigned_to = ${user.id}) OR
           (${sorumluFiltre} = 'atanmamis' AND p.assigned_to IS NULL) OR
           (${sorumluId}::int IS NOT NULL AND p.assigned_to = ${sorumluId}::int))
      AND (${webFiltre}::text = '' OR p.has_website = ${webFiltre}::text)
      AND (${ajansFiltre}::text = '' OR p.worked_with_agency = ${ajansFiltre}::text)
      AND (
        cardinality(${desenler}::text[]) = 0
        OR tr_fold(p.name || ' ' || COALESCE(p.contact_person, '') || ' '
                   || COALESCE(p.city, '') || ' ' || COALESCE(p.source, '') || ' '
                   || COALESCE(p.last_note, '')) ~ ALL(${desenler}::text[])
        OR (${numaraArama}::text IS NOT NULL AND p.phone_norm LIKE ${'%' + (numaraArama ?? '') + '%'})
      )
    ORDER BY p.created_at
  `) as Array<Record<string, string | number | null>>;

  const basliklar = [
    'Ad / Firma', 'Yetkili', 'Telefon', 'Durum', 'Tekrar Ara', 'Son Not',
    'Arama Sayısı', 'Son Arama', 'Son Arayan', 'Sorumlu', 'Şehir / İlçe', 'Kaynak',
    'Instagram / Web',
    ...marka.ekAlanlar.map((e) => EK_ALANLAR[e].baslik),
    'Eklenme Tarihi',
  ];

  const govde = satirlar.map((r) => {
    const tel = telefonCoz(r.phone_raw as string | null);
    const alanlar: unknown[] = [
      r.name, r.contact_person,
      // Boşluklu yazım: Excel baştaki 0'ı atmasın, bilimsel gösterime çevirmesin
      tel.gecerli ? tel.gorunum : r.phone_raw,
      DURUM_HARITA[String(r.status)]?.ad ?? r.status,
      tarihTR(r.next_call_on as string | null),
      r.last_note, r.call_count,
      tarihTR(r.last_call_at as string | null), r.son_arayan, r.sorumlu,
      r.city, r.source, r.link,
      ...marka.ekAlanlar.map((e) => {
        const deger = String(e === 'web' ? r.has_website : r.worked_with_agency);
        return EK_ALANLAR[e].etiket[deger as 'var' | 'yok' | 'bilinmiyor']?.uzun ?? deger;
      }),
      tarihTR(r.created_at as string | null),
    ];
    return alanlar.map(hucre).join(';');
  });

  const csv = `﻿${[basliklar.map(hucre).join(';'), ...govde].join('\r\n')}\r\n`;
  const dosya = `${marka.yol}-adaylar-${bugun()}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${dosya}"`,
      'Cache-Control': 'no-store',
    },
  });
}
