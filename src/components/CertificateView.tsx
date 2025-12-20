'use client';

import * as React from 'react';

export type CertificateViewProps = {
  name: string;
  school: string;
  ticketCode: string;
  date: string;
};

export function CertificateView(props: CertificateViewProps) {
  const { name, school, ticketCode, date } = props;

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

          /*
            Hard guarantee: hide the entire app during printing,
            then selectively reveal only the certificate.
          */
          body * {
            visibility: hidden !important;
          }

          .certificate-print-root,
          .certificate-print-root * {
            visibility: visible !important;
          }

          .certificate-print-root {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          .certificate-no-print {
            display: none !important;
          }

          .certificate-sheet {
            max-width: none !important;
            width: 100% !important;
            height: 100% !important;
            box-shadow: none !important;
          }

          .certificate-sheet > * {
            height: 100% !important;
          }
        }
      `}</style>

      <div className="certificate-print-root">
        <div className="certificate-sheet mx-auto w-full max-w-[1100px] bg-white shadow-2xl">
          {/* Outer premium frame */}
          <div className="p-3 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
            <div className="p-2 bg-gradient-to-br from-amber-300 via-yellow-100 to-amber-300">
              <div className="relative bg-white">
                {/* A4 Landscape Ratio (297mm x 210mm) */}
                <div className="relative w-full aspect-[297/210]">
                  {/* Corner ornaments */}
                  <div className="absolute left-6 top-6 w-12 h-12 rounded-full border-4 border-amber-300" />
                  <div className="absolute right-6 top-6 w-12 h-12 rounded-full border-4 border-amber-300" />
                  <div className="absolute left-6 bottom-6 w-12 h-12 rounded-full border-4 border-amber-300" />
                  <div className="absolute right-6 bottom-6 w-12 h-12 rounded-full border-4 border-amber-300" />

                  {/* Inner content */}
                  <div className="absolute inset-0 p-10 md:p-14 flex flex-col">
                    {/* Header */}
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center gap-3">
                        <div className="h-px w-16 bg-amber-300" />
                        <div className="text-[12px] font-black tracking-[0.35em] text-blue-950 uppercase">
                          Event Certificate
                        </div>
                        <div className="h-px w-16 bg-amber-300" />
                      </div>

                      <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-blue-950">
                        CERTIFICATE OF PARTICIPATION
                      </h1>

                      <div className="mt-3 text-sm font-semibold text-slate-500">
                        This certificate is proudly presented to
                      </div>
                    </div>

                    {/* Name (hero) */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                      <div className="text-5xl md:text-7xl font-serif font-semibold text-blue-950 tracking-tight leading-[1.05]">
                        {name}
                      </div>

                      <div className="mt-5 max-w-3xl text-base md:text-lg font-medium text-slate-600 leading-relaxed">
                        for participating in our event and demonstrating outstanding enthusiasm and commitment.
                      </div>

                      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                          <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                            School
                          </div>
                          <div className="mt-1 text-lg font-black text-slate-900">{school}</div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                          <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                            Ticket Code
                          </div>
                          <div className="mt-1 text-lg font-black text-slate-900 font-mono tracking-wider">
                            {ticketCode}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                          <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                            Date
                          </div>
                          <div className="mt-1 text-lg font-black text-slate-900">{date}</div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 flex items-end justify-between gap-8">
                      {/* Authenticity note */}
                      <div className="text-left">
                        <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                          Certificate ID
                        </div>
                        <div className="mt-1 text-sm font-mono font-bold text-blue-950">
                          {ticketCode}
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                          Verified by event system
                        </div>
                      </div>

                      {/* Signature */}
                      <div className="text-right min-w-[280px]">
                        <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                          Headmaster
                        </div>
                        <div className="mt-10 border-b-2 border-blue-950/70" />
                        <div className="mt-2 text-xs font-semibold text-slate-500">Signature</div>
                      </div>
                    </div>

                    {/* Decorative bottom line */}
                    <div className="mt-8 h-1 w-full bg-gradient-to-r from-amber-300 via-blue-950 to-amber-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="certificate-no-print mt-6 flex justify-center">
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
