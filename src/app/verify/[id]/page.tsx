import type { Metadata } from 'next';
import Link from 'next/link';

import { supabase } from '@/lib/supabase';

type VerifyPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Verifikasi Sertifikat',
};

function buildConfigMap(rows: Array<{ key: string; value: any }> | null | undefined) {
  const conf: Record<string, any> = {};
  rows?.forEach((item) => {
    conf[item.key] = item.value;
  });
  return conf;
}

function buildCertificateNumber(options: {
  id: string | number;
  cert_number_format?: string;
}) {
  const rawAsString = String(options.id ?? '').trim();
  if (!rawAsString) return '';

  const digitsOnly = rawAsString.replace(/[^0-9]/g, '');
  const paddedNo = digitsOnly ? digitsOnly.padStart(6, '0') : rawAsString;

  const formatRaw = String(options.cert_number_format ?? '').trim();
  if (formatRaw) return formatRaw.split('[NO]').join(paddedNo);

  if (digitsOnly) return `CERT-${paddedNo}`;
  return `CERT-${rawAsString}`;
}

export default async function VerifyCertificatePage(props: VerifyPageProps) {
  const { id } = await props.params;
  const normalizedId = String(id ?? '').trim();

  const [settingsRes, participantRes] = await Promise.all([
    supabase.from('event_settings').select('key,value'),
    supabase.from('participants').select('*').eq('id', normalizedId).maybeSingle(),
  ]);

  const config = buildConfigMap(settingsRes.data);
  const participant = participantRes.data;

  const certificateNumber = participant
    ? buildCertificateNumber({
        id: participant.id,
        cert_number_format: config?.cert_number_format,
      })
    : '';

  const isValid = Boolean(participant) && String(participant?.status ?? '').toUpperCase() === 'CHECKED-IN';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-sm font-semibold text-slate-500">Verifikasi Dokumen</div>
              <h1 className="mt-1 text-2xl md:text-3xl font-black tracking-tight">Sertifikat Peserta</h1>
            </div>
            <div
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black tracking-widest border ${
                isValid
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {isValid ? 'VALID' : 'TIDAK VALID'}
            </div>
          </div>

          {(settingsRes.error || participantRes.error) && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Terjadi kendala saat memuat data verifikasi. Silakan coba lagi.
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">ID</div>
              <div className="mt-1 font-mono text-sm font-bold text-slate-900 break-all">{normalizedId}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">Nomor Sertifikat</div>
              <div className="mt-1 text-sm font-bold text-slate-900 wrap-break-word">
                {certificateNumber || '-'}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">Nama</div>
              <div className="mt-1 text-lg font-black text-slate-900">{participant?.name ?? '-'}</div>
              <div className="mt-1 text-sm text-slate-600">{participant?.origin_school ?? '-'}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">Status</div>
              <div className="mt-1 text-sm font-bold text-slate-900">{String(participant?.status ?? '-')}</div>
              <div className="mt-2 text-xs text-slate-500">
                Dokumen dinyatakan <span className="font-semibold">valid</span> apabila status peserta adalah{' '}
                <span className="font-semibold">CHECKED-IN</span>.
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-white font-bold hover:bg-slate-800 transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <div className="text-xs text-slate-500">
              Halaman verifikasi ini dibuat untuk QR TTE.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
