'use client';

import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export type CertificateViewProps = {
  name: string;
  school: string;
  ticketCode: string;
  date: string;

  // Dynamic certificate configuration (letterhead, address, signature, stamp, etc)
  config: {
    event_logo_url?: string;
    site_url?: string;
    kop_agency_1?: string;
    kop_agency_2?: string;
    school_address?: string;
    cert_number_format?: string;
    headmaster_name?: string;
    headmaster_nip?: string;
  };

  // Participant data used for certificate numbering
  data: {
    id: string | number;
    certificate_no?: string | number | null;
  };
};

export function CertificateView(props: CertificateViewProps) {
  const { name, school, ticketCode, date, config, data } = props;

  const certificateNumber = React.useMemo(() => {
    const rawId = data?.id;
    const rawAsString = String(rawId ?? "").trim();
    if (!rawAsString) return "";

    const digitsOnly = rawAsString.replace(/[^0-9]/g, "");
    const paddedNo = digitsOnly ? digitsOnly.padStart(6, '0') : rawAsString;

    const formatRaw = String(config?.cert_number_format ?? "").trim();
    if (formatRaw) {
      // Replace all occurrences of [NO]
      return formatRaw.split('[NO]').join(paddedNo);
    }

    // Backward-compatible default
    if (digitsOnly) {
      return `CERT-${paddedNo}`;
    }
    return `CERT-${rawAsString}`;
  }, [data?.id, config?.cert_number_format]);

  const verifyUrl = React.useMemo(() => {
    const rawId = String(data?.id ?? '').trim();
    const fallback = `https://yoursite.com/verify/${encodeURIComponent(rawId)}`;
    if (typeof window === 'undefined') return fallback;
    try {
      const fromConfig = String(config?.site_url ?? '').trim();
      const fromEnv = String(process.env.NEXT_PUBLIC_SITE_URL ?? '').trim();
      const base = (fromConfig || fromEnv || window.location.origin).replace(/\/$/, '');
      return `${base}/verify/${encodeURIComponent(rawId)}`;
    } catch {
      return fallback;
    }
  }, [data?.id, config?.site_url]);

  const handlePrint = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    window.print();
  }, []);

  return (
    <div className="w-full">
      {/*
        Print rules are kept here so the component is self-contained.
        This ensures A4 landscape output and hides UI controls.
      */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .certificate-sheet {
            max-width: none !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            box-shadow: none !important;
          }

          .certificate-aspect {
            width: 100vw !important;
            height: 100vh !important;
          }
        }
      `}</style>

      <div className="certificate-sheet mx-auto w-full max-w-275 bg-white shadow-2xl print:shadow-none">
        {/* A4 Landscape Ratio (297mm x 210mm) */}
        <div className="certificate-aspect relative w-full aspect-297/210 bg-white text-black font-serif">
          <div className="absolute inset-0 p-10 md:p-14 flex flex-col">
            {/* Header / Kop Surat */}
            <div className="grid grid-cols-[96px_1fr_96px] items-center gap-4">
              <div className="flex items-center justify-start">
                {config?.event_logo_url ? (
                  <img
                    src={config.event_logo_url}
                    alt="Logo"
                    className="h-20 w-20 object-contain"
                  />
                ) : (
                  <div className="h-20 w-20" />
                )}
              </div>

              <div className="text-center leading-tight">
                <div className="text-sm font-bold uppercase tracking-wide">
                  {config?.kop_agency_1 ?? ''}
                </div>
                <div className="text-lg md:text-xl font-bold uppercase">
                  {config?.kop_agency_2 ?? ''}
                </div>
                <div className="mt-1 text-xs md:text-sm">{config?.school_address ?? ''}</div>
              </div>

              <div />
            </div>

            {/* Double-line separator */}
            <div className="mt-4">
              <div className="h-px bg-black" />
              <div className="mt-1 h-0.5 bg-black" />
            </div>

            {/* Title */}
            <div className="mt-8 text-center">
              <div className="text-3xl md:text-4xl font-bold tracking-[0.25em]">SERTIFIKAT</div>
              <div className="mt-3 text-base md:text-lg">
                Nomor: <span className="font-semibold">{certificateNumber}</span>
              </div>
            </div>

            {/* Body */}
            <div className="mt-10 flex-1 flex flex-col justify-center">
              <div className="text-base md:text-lg leading-relaxed">
                Kepala Sekolah memberikan sertifikat kepada:
              </div>

              <div className="mt-6 text-center">
                <div className="text-4xl md:text-5xl font-bold">{name}</div>
                <div className="mt-3 text-sm md:text-base">{school}</div>
              </div>

              <div className="mt-8 text-base md:text-lg leading-relaxed">
                Sebagai Peserta kegiatan Expo SMKN 1 Kademangan.
              </div>

              <div className="mt-6 text-sm md:text-base">
                Kode Tiket: <span className="font-semibold">{ticketCode}</span>
                <span className="mx-3">•</span>
                Tanggal: <span className="font-semibold">{date}</span>
              </div>
            </div>

            {/* Footer: Digital Signature (TTE) */}
            <div className="mt-8 flex items-end justify-between gap-8">
              <div className="text-xs leading-relaxed">
                <div className="font-semibold">Catatan Validasi</div>
                <div>Scan QR untuk verifikasi keaslian dokumen.</div>
              </div>

              <div className="text-right min-w-[320px]">
                <div className="text-sm font-semibold">Kepala Sekolah</div>
                <div className="mt-4 inline-flex flex-col items-end">
                  <div className="border border-black p-2">
                    <QRCodeSVG value={verifyUrl} size={96} bgColor="#ffffff" fgColor="#000000" />
                  </div>
                  <div className="mt-2 text-[10px] leading-tight max-w-55">
                    Dokumen ini telah ditandatangani secara elektronik (BSrE).
                  </div>
                  <div className="mt-3 text-sm font-bold">{config?.headmaster_name ?? ''}</div>
                  <div className="text-sm">NIP. {config?.headmaster_nip ?? ''}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-center print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-xl bg-blue-950 px-6 py-4 text-white font-black shadow-lg hover:bg-blue-900 transition-colors"
        >
          Download / Print
        </button>
      </div>
    </div>
  );
}

export default CertificateView;
