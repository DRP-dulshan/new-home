import QRCode from 'qrcode';

/** Dubai Land Department's public service for checking an advertising permit */
const DLD_CHECK = 'https://dubailand.gov.ae/en/eservices/validate-real-estate-licenses-and-permits';

type Props = { permit: string; permitUrl: string | null };

/**
 * A listing's DLD advertising permit. When Property Finder supplies the
 * Trakheesi (Madmoun) validation page, it is shown as the QR code Dubai's
 * advertising rules ask for; otherwise the permit links to DLD's own check.
 */
export default async function PermitCheck({ permit, permitUrl }: Props) {
  const qr = permitUrl
    ? await QRCode.toString(permitUrl, { type: 'svg', margin: 0, color: { dark: '#1a1a1a', light: '#0000' } })
    : null;

  return (
    <div className="mt-8 flex items-center gap-5 border border-line p-5">
      {qr ? (
        <a
          href={permitUrl!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Check DLD permit ${permit} with Dubai Land Department`}
          className="block h-20 w-20 shrink-0 [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: qr }}
        />
      ) : null}
      <div>
        <p className="text-[10px] uppercase tracking-eyebrow text-charcoal-muted">DLD advertising permit</p>
        <p className="mt-1 text-[15px] font-light text-charcoal">{permit}</p>
        <a
          href={permitUrl ?? DLD_CHECK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[13px] font-light text-charcoal-muted underline-offset-4 hover:text-orange hover:underline"
        >
          {qr ? 'Scan or tap to verify with Dubai Land Department' : 'Verify with Dubai Land Department'}
        </a>
      </div>
    </div>
  );
}
