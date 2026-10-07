import { siteYolu, whatsappBaglantisi } from '@/lib/site';
import Dugme from './Dugme';
import { IkonWhatsApp } from './Ikonlar';

type Props = {
  /** Birincil çağrı (varsayılan: ücretsiz analiz) */
  cagri?: { etiket: string; href: string };
  waMetni?: string;
};

/**
 * Mobil sabit alt şerit. Hero geçildikten sonra belirir, alt bilgiye
 * gelince gizlenir — görünürlüğü Efektler yönetir:
 *   `[data-alt-cta-gizle]` işaretli bölümler ekrandayken şerit saklanır
 *   (hero ve alt bilgi bu işareti taşır).
 * `safe-area-inset-bottom` hesaba katılır; masaüstünde hiç basılmaz.
 */
export default function AltCtaSerit({
  cagri = { etiket: 'Ücretsiz analiz', href: '/analiz' },
  waMetni = 'Merhaba, Ajans Flow sitesinden yazıyorum. Ücretsiz dijital analiz istiyorum.',
}: Props) {
  return (
    <div className="af-alt-serit" data-alt-cta="" aria-label="Hızlı iletişim">
      <Dugme tur="ikincil" href={whatsappBaglantisi(waMetni)} whatsapp>
        <IkonWhatsApp />
        WhatsApp
      </Dugme>
      <Dugme href={siteYolu(cagri.href)}>{cagri.etiket}</Dugme>
    </div>
  );
}
