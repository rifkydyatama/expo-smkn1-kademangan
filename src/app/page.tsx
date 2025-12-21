"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useInView,
  Variants 
} from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabase"; 
import { 
  Loader2, 
  Sparkles, 
  School, 
  Ticket, 
  Calendar, 
  PlayCircle, 
  Cpu, 
  Globe, 
  ChevronDown, 
  CheckCircle, 
  Instagram, 
  ArrowRight, 
  Star, 
  Quote, 
  Zap, 
  Award, 
    User,
  Lock, 
  Mic, 
  X,
    Printer,
  Info,
  Construction,
  Timer
} from "lucide-react";

// --- 1. COMPLEX ANIMATION VARIANTS (EXPANDED) ---
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    } 
  }
};

const fadeLeftVariant: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    } 
  }
};

const scaleUpVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.5, 
      ease: "backOut" 
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const HighlightIcon = ({ name, className }: { name: string; className?: string }) => {
    if (name === "Star") return <Star className={className} />;
    if (name === "Award") return <Award className={className} />;
    if (name === "Zap") return <Zap className={className} />;
    if (name === "User") return <User className={className} />;
    return null;
};

const getYoutubeId = (raw: unknown): string => {
    const input = String(raw ?? "").trim();
    if (!input) return "";

    // Already looks like an ID
    if (/^[a-zA-Z0-9_-]{6,}$/.test(input) && !input.includes("/") && !input.includes("?")) {
        return input;
    }

    try {
        const url = new URL(input);

        // youtube.com/watch?v=ID
        const vParam = url.searchParams.get("v");
        if (vParam) return vParam;

        // youtu.be/ID
        if (url.hostname.includes("youtu.be")) {
            const idFromPath = url.pathname.replace("/", "").trim();
            if (idFromPath) return idFromPath;
        }

        // youtube.com/embed/ID
        const embedMatch = url.pathname.match(/\/embed\/([^/?#]+)/);
        if (embedMatch?.[1]) return embedMatch[1];

        return "";
    } catch {
        return "";
    }
};

// --- 2. COMPONENT: ANIMATED COUNTER (PRECISE) ---
const Counter = memo(({ to }: { to: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2500; // Lebih smooth
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // EaseOutQuart function for smoother finish
      const ease = 1 - Math.pow(1 - progress, 4); 
      
      const currentVal = Math.floor(ease * to);
      
      if (nodeRef.current) {
        nodeRef.current.textContent = currentVal.toLocaleString('id-ID');
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (nodeRef.current) nodeRef.current.textContent = to.toLocaleString('id-ID');
      }
    };

    requestAnimationFrame(animate);
  }, [to, isInView]);

  return <span ref={nodeRef} className="tabular-nums tracking-tight">0</span>;
});

// --- 3. COMPONENT: BACKGROUND 5.0 (FULL DETAIL) ---
// Ini versi background yang lebih detail dengan lebih banyak layer
const TechBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 selection:bg-cyan-300 selection:text-cyan-900 pointer-events-none">
    {/* Grid Layer 1 */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px]"></div>
    
    {/* Grid Layer 2 (Larger) */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-size-[160px_160px]"></div>

        {/* Floating Orbs (CSS Animation for Performance) */}
        <div className="expo-orb expo-orb-cyan absolute top-[-10%] right-[-10%] w-200 h-200 bg-cyan-400/20 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="expo-orb expo-orb-purple absolute bottom-[-10%] left-[-10%] w-200 h-200 bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="expo-orb expo-orb-blue absolute top-[40%] left-[40%] w-96 h-96 bg-blue-500/10 rounded-full blur-[80px]" />
  </div>
);

// --- 4. COMPONENT: MAINTENANCE / COMING SOON SCREEN (BARU) ---
const MaintenanceScreen = ({ mode }: { mode: string }) => (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-900 text-white relative overflow-hidden p-6 text-center">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/80"></div>
      
      {/* Animated Glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
        transition={{ duration: 4, repeat: Infinity }} 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-cyan-500/20 rounded-full blur-[100px]"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl"
      >
          <div className="mb-8 flex justify-center">
              {mode === 'MAINTENANCE' ? (
                  <div className="w-24 h-24 bg-yellow-500/20 rounded-3xl flex items-center justify-center border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                      <Construction className="w-12 h-12 text-yellow-400" />
                  </div>
              ) : (
                  <div className="w-24 h-24 bg-cyan-500/20 rounded-3xl flex items-center justify-center border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                      <Timer className="w-12 h-12 text-cyan-400" />
                  </div>
              )}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              {mode === 'MAINTENANCE' ? "UNDER MAINTENANCE" : "COMING SOON"}
          </h1>
          
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              {mode === 'MAINTENANCE' 
                ? "Sistem sedang dalam perbaikan berkala untuk meningkatkan performa. Kami akan segera kembali." 
                : "Kami sedang menyiapkan sesuatu yang luar biasa untuk Expo SMKN 1 Kademangan tahun ini. Tunggu tanggal mainnya!"}
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold tracking-widest uppercase text-slate-300">System Offline</span>
          </div>
      </motion.div>
  </div>
);

// --- 5. COMPONENT: CAMPUS MARQUEE (DETAIL CARD) ---
const CampusMarquee = memo(({ items }: { items: any[] }) => {
    if (!items || items.length === 0) return null;

    // Build a "half" track big enough to fill the viewport, then duplicate it.
    // This keeps the CSS animation (-50%) seamless with no layout shifts.
    const minCardsPerHalf = 10;
    const repeats = Math.max(1, Math.ceil(minCardsPerHalf / Math.max(1, items.length)));
    const half = Array.from({ length: repeats }).flatMap(() => items);
    const marqueeItems = [...half, ...half];

    return (
        <section className="py-20 bg-white border-y border-slate-200 overflow-hidden relative z-20 md:bg-white/80 md:backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
                <span className="text-cyan-600 font-bold tracking-[0.3em] uppercase text-xs block mb-3">
                    Official Partners & Sponsors
                </span>
                <h2 className="text-3xl font-black text-slate-900">Didukung Oleh Kampus Ternama</h2>
            </div>

            <div className="w-full overflow-hidden relative group">
                {/* Fade gradients (kept lightweight; no blur) */}
                <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-linear-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-linear-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-8 w-max px-6 expo-marquee-track transform-gpu will-change-transform group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]">
                    {marqueeItems.map((c, i) => (
                        <div
                            key={`${i}-${c?.id ?? c?.name ?? "item"}`}
                            className="shrink-0 w-72 p-8 bg-white border border-slate-100 rounded-4xl shadow-none transition-all duration-300 flex flex-col items-center justify-center text-center group/card cursor-default md:shadow-sm md:hover:shadow-xl"
                        >
                            <div className="h-24 w-full flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-0 bg-slate-100 rounded-full scale-0 group-hover/card:scale-100 transition-transform duration-300 opacity-20" />
                                {c.logo_url ? (
                                    <img
                                        src={c.logo_url}
                                        alt={c.name}
                                        className="max-h-full max-w-full object-contain grayscale group-hover/card:grayscale-0 transition-all duration-500 scale-90 group-hover/card:scale-110"
                                    />
                                ) : (
                                    <School className="w-16 h-16 text-slate-300 group-hover/card:text-cyan-500 transition-colors duration-300" />
                                )}
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg group-hover/card:text-cyan-700 transition-colors">{c.name}</h3>
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2 px-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                {c.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

// --- 5.5. CERTIFICATE VIEW (DINAS STYLE - OFFICIAL) ---
const CertificateView = ({ data, config, onClose }: { data: any, config: any, onClose: () => void }) => {
    // 1. Format Nomor Surat
    const rawFormat = config.cert_number_format || "421.5/[NO]/SMK.01/2025";
    const certNumber = rawFormat.replace('[NO]', String(data.id).padStart(3, '0'));
    
    // 2. Tanggal
    const dateObj = new Date();
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const today = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    
    // URL Validasi
    const validationUrl = `https://expo-smkn1-kademangan.vercel.app/verify/${data.ticket_code || data.id}`;

    return (
        <div className="fixed inset-0 z-[300] bg-slate-900/95 flex flex-col items-center justify-start pt-4 pb-8 px-2 overflow-y-auto print:bg-white print:p-0 print:block print:overflow-visible print:static">
            
            {/* CSS Print & Responsive Logic */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: auto;   /* Biarkan user memilih Landscape/Portrait di dialog print */
                        margin: 0mm;  /* Hilangkan margin default */
                    }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* Sembunyikan elemen UI */
                    nav, footer, button, .no-print {
                        display: none !important;
                    }
                    /* Reset container sertifikat saat print */
                    .cert-scale-wrapper {
                        transform: none !important;
                        height: auto !important;
                        width: 100% !important;
                        display: block !important;
                        overflow: visible !important;
                    }
                    .cert-paper {
                        width: 100% !important;
                        height: auto !important;
                        aspect-ratio: 297/210 !important;
                        box-shadow: none !important;
                        margin: 0 auto !important;
                        page-break-after: always;
                    }
                }
            `}</style>

            {/* Tombol Navigasi (Hilang saat Print) */}
            <div className="w-full max-w-4xl flex justify-between mb-6 print:hidden z-50 px-4">
                <button onClick={onClose} className="text-white flex items-center gap-2 hover:text-red-400 font-bold bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors text-sm md:text-base">
                    <X size={18}/> Tutup
                </button>
                <button onClick={() => window.print()} className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 md:px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-amber-500/20 text-sm md:text-base">
                    <Printer size={18}/> Cetak / PDF
                </button>
            </div>

            {/* WRAPPER SCALING (Agar Responsif di HP) */}
            <div className="w-full flex justify-center items-start print:block print:w-full print:h-full">
                {/* Teknik Scaling:
                   - Mobile (Default): scale-[0.28] -> Mengecilkan sertifikat besar ke layar HP
                   - Tablet (sm): scale-[0.45]
                   - Laptop (lg): scale-[0.8]
                   - Layar Besar (xl): scale-100 (Ukuran Asli)
                   - Print: scale-100 (Ukuran Asli Kertas)
                */}
                <div className="cert-scale-wrapper origin-top transition-transform duration-300 transform scale-[0.34] xs:scale-[0.4] sm:scale-[0.55] md:scale-[0.7] lg:scale-[0.85] xl:scale-100 print:transform-none print:scale-100">
                    
                    {/* KERTAS SERTIFIKAT (A4 LANDSCAPE: 297mm x 210mm) */}
                    <div className="cert-paper bg-[#fffdf5] text-slate-900 w-[297mm] h-[210mm] relative shadow-2xl overflow-hidden font-serif leading-none flex flex-col mx-auto">
                        
                        {/* === DEKORASI BACKGROUND === */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 mix-blend-multiply pointer-events-none"></div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                            {config.event_logo_url ? <img src={config.event_logo_url} className="w-[150mm] h-[150mm] object-contain grayscale" /> : <School size={500} />}
                        </div>
                        <div className="absolute inset-5 border-[3px] border-slate-800 pointer-events-none z-20"></div>
                        <div className="absolute inset-3 border-[8px] border-double border-yellow-600/30 pointer-events-none z-10"></div>
                        
                        {/* ORNAMEN SUDUT */}
                        <div className="absolute top-0 left-0 w-40 h-40 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] opacity-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] opacity-10 pointer-events-none rotate-180"></div>

                        {/* === KONTEN UTAMA === */}
                        <div className="relative z-30 w-full h-full flex flex-col justify-between pt-16 pb-12 px-20">
                            
                            {/* 1. HEADER (KOP SURAT) */}
                            <div className="flex items-center justify-center border-b-[3px] border-slate-800 pb-6 relative">
                                <div className="absolute left-4 top-0 w-24 h-24 flex items-center justify-center">
                                     {config.event_logo_url ? <img src={config.event_logo_url} alt="Logo" className="max-h-full max-w-full object-contain" /> : <School size={60} className="text-slate-400"/>}
                                </div>
                                <div className="text-center w-full px-28">
                                    <h3 className="text-xl tracking-[0.1em] font-medium text-slate-600 uppercase mb-1">{config.kop_agency_1 || "PEMERINTAH PROVINSI JAWA TIMUR"}</h3>
                                    <h3 className="text-xl tracking-[0.1em] font-bold text-slate-700 uppercase mb-2">{config.kop_agency_2 || "DINAS PENDIDIKAN"}</h3>
                                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-widest scale-y-110">SMK NEGERI 1 KADEMANGAN</h1>
                                    <p className="text-sm font-medium italic text-slate-500 mt-1">{config.school_address || "Jl. Mawar No. 12, Kademangan, Blitar"}</p>
                                </div>
                            </div>

                            {/* 2. BODY (JUDUL & NAMA) */}
                            <div className="flex-1 flex flex-col items-center justify-center text-center -mt-4">
                                <h2 className="text-6xl font-black text-yellow-600/90 mb-3 tracking-[0.2em] font-serif" style={{ fontFamily: 'Times New Roman' }}>SERTIFIKAT</h2>
                                <p className="text-lg font-bold text-slate-500 tracking-widest mb-8 font-mono">NO: {certNumber}</p>

                                <p className="text-xl text-slate-700 mb-6 font-medium">Kepala SMK Negeri 1 Kademangan memberikan penghargaan kepada:</p>
                                
                                {/* NAMA PESERTA */}
                                <div className="w-full mb-8 relative">
                                    <h1 className="text-5xl font-black text-slate-900 uppercase tracking-wide scale-y-105 px-8 pb-2 border-b-2 border-slate-300 inline-block min-w-[50%]">
                                        {data.name}
                                    </h1>
                                    <p className="text-2xl font-bold text-slate-600 mt-3">({data.origin_school})</p>
                                </div>

                                <p className="text-xl leading-relaxed max-w-5xl mx-auto text-slate-700 px-10">
                                    Atas partisipasinya sebagai <strong className="text-yellow-700 uppercase font-bold">PESERTA AKTIF</strong> dalam kegiatan 
                                    <span className="font-bold text-2xl block mt-2 mb-1">"{config.hero_title || 'EXPO VOKASI 2025'}"</span>
                                    yang diselenggarakan pada tanggal {config.event_date || "20 Mei 2025"}.
                                </p>
                            </div>

                            {/* 3. FOOTER (TTD & QR) */}
                            <div className="w-full flex justify-end pr-8">
                                <div className="text-center w-[300px]">
                                    <p className="text-lg text-slate-600 mb-1">Blitar, {today}</p>
                                    <p className="text-lg font-bold text-slate-800 mb-6">Kepala Sekolah,</p>
                                    
                                    {/* Area TTD / QR */}
                                    <div className="h-32 flex items-center justify-center relative mb-2">
                                         <div className="bg-white p-2 rounded-xl shadow-sm border-2 border-slate-200 relative z-10">
                                             <QRCodeSVG 
                                                value={validationUrl} 
                                                size={90} 
                                                level="H" 
                                                fgColor="#1e293b"
                                             />
                                         </div>
                                         {/* Garis Dekorasi */}
                                         <div className="absolute inset-x-4 top-1/2 h-[1px] bg-slate-300 -z-0"></div>
                                    </div>

                                    <p className="text-lg font-bold text-slate-900 underline underline-offset-4 decoration-2 uppercase mt-1">
                                        {config.headmaster_name || "NAMA KEPALA SEKOLAH"}
                                    </p>
                                    <p className="text-lg text-slate-600 mt-1">NIP. {config.headmaster_nip || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 6. MAIN PAGE COMPONENT ---
export default function Home() {
  const [isChecking, setIsChecking] = useState(true);
    const [view, setView] = useState<"landing" | "register" | "ticket" | "certificate" | "maintenance">("landing");
  const [siteMode, setSiteMode] = useState("LIVE"); // Default LIVE
    const [initError, setInitError] = useState<string | null>(null);
  
  // Data State
  const [config, setConfig] = useState<any>({});
  const [campuses, setCampuses] = useState<any[]>([]);
  const [rundown, setRundown] = useState<any[]>([]);
    const [highlights, setHighlights] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  
  // Real-time Counts
  const [realCounts, setRealCounts] = useState({ participants: 0, campuses: 0 });

  // UI State
  const [videoOpen, setVideoOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", origin_school: "", phone: "" });
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

    // --- CERTIFICATE CHECK STATE (VERBOSE) ---
    const [certificateTicketCode, setCertificateTicketCode] = useState("");
    const [certificateParticipant, setCertificateParticipant] = useState<any>(null);
    const [certificateChecking, setCertificateChecking] = useState(false);
    const [certificateOverlayOpen, setCertificateOverlayOpen] = useState(false);
    const [certificateReturnView, setCertificateReturnView] = useState<"certificate" | "ticket">("certificate");

  // --- NEW: NOTIFICATION STATE ---
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });
  
  // Helper Notifikasi
    const showNotify = useCallback((message: string, type: "info" | "error" | "success" = "info") => {
      setNotification({ show: true, message, type: type as "info" | "error" }); // Fixed type assertion
    }, []);

      useEffect(() => {
          console.log('Logo URL:', config.event_logo_url);
      }, [config.event_logo_url]);

  // Parallax Hooks
  const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);
  const yVideo = useTransform(scrollY, [500, 1000], [50, -50]);

    const youtubeId = getYoutubeId(config.youtube_video_id);
    const youtubeThumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : "";

  // --- INITIALIZATION ---
  useEffect(() => {
        let isCancelled = false;
        let refetchTimer: number | null = null;

        const scheduleRefetch = (reason: string) => {
            if (isCancelled) return;
            if (refetchTimer) window.clearTimeout(refetchTimer);
            refetchTimer = window.setTimeout(() => {
                void fetchLandingData(`realtime:${reason}`);
            }, 350);
        };

        const fetchLandingData = async (reason: string): Promise<{ siteMode: string }> => {
        try {
                        console.debug("[landing] fetching data", { reason });

                const [settingsRes, campusesRes, rundownRes, highlightsRes, faqRes] = await Promise.all([
                                supabase.from("event_settings").select("*"),
                                supabase.from("event_campuses").select("*").order('id'),
                                supabase.from("event_rundown").select("*").order('id'),
                    supabase.from("event_highlights").select("*").order('id'),
                                supabase.from("event_faq").select("*").order('id')
                        ]);

                        if (settingsRes.error) {
                            console.error("[landing] failed to fetch event_settings", settingsRes.error);
                        }
                        if (campusesRes.error) {
                            console.error("[landing] failed to fetch event_campuses", campusesRes.error);
                        }
                        if (rundownRes.error) {
                            console.error("[landing] failed to fetch event_rundown", rundownRes.error);
                        }
                        if (highlightsRes.error) {
                            console.error("[landing] failed to fetch event_highlights", highlightsRes.error);
                        }
                        if (faqRes.error) {
                            console.error("[landing] failed to fetch event_faq", faqRes.error);
                        }

                        const conf: any = {};
                        settingsRes.data?.forEach((item: any) => {
                            conf[item.key] = item.value;
                        });

                        if (!conf.site_mode) conf.site_mode = "LIVE";
                        if (!conf.status) conf.status = "OPEN";

                        if (!isCancelled) {
                            setConfig(conf);
                            setSiteMode(conf.site_mode);

                            if (campusesRes.data) setCampuses(campusesRes.data);
                            if (rundownRes.data) setRundown(rundownRes.data);
                            if (highlightsRes.data) setHighlights(highlightsRes.data);
                            if (faqRes.data) setFaqs(faqRes.data);
                        }

                        const { count: participantCount, error: participantCountError } = await supabase
                                .from("participants")
                                .select("*", { count: "exact", head: true });

                        if (participantCountError) {
                            console.error("[landing] failed to fetch participants count", participantCountError);
                        }

                        if (!isCancelled) {
                            setRealCounts({
                                participants: participantCount || 0,
                                campuses: campusesRes.data?.length || 0
                            });

                            if (conf.site_mode === 'MAINTENANCE' || conf.site_mode === 'COMING_SOON') {
                                setView("maintenance");
                            }
                        }
                        return { siteMode: conf.site_mode };
                } catch (error) {
                        console.error("[landing] fetchLandingData error", error);
                        if (!isCancelled) {
                            setInitError("Gagal memuat data dari server. Periksa koneksi atau konfigurasi Supabase (RLS / env). Lihat console untuk detail.");
                        }
                        return { siteMode: "LIVE" };
                }
        };

        const initSystem = async () => {
            try {
                setInitError(null);

                const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const envAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
                if (!envUrl || !envAnon) {
                    console.warn("[landing] Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (fallbacks may be used in src/lib/supabase.ts)");
                }

                const savedTicketID = localStorage.getItem("smkn1_expo_ticket_id");

                const { siteMode: resolvedMode } = await fetchLandingData("init");
                if (isCancelled) return;

                // If maintenance, stop further flows
                if (resolvedMode === 'MAINTENANCE' || resolvedMode === 'COMING_SOON') {
                    setIsChecking(false);
                    return;
                }

                if (savedTicketID) {
                        const { data, error } = await supabase
                                .from("participants")
                                .select("*")
                                .eq("id", savedTicketID)
                                .single();

                        if (error) {
                            console.warn("[landing] failed to load saved ticket", { savedTicketID, error });
                        }

                        if (data) { 
                                setTicketData(data); 
                                setView("ticket"); 
                        } else { 
                                localStorage.removeItem("smkn1_expo_ticket_id"); 
                                setView("landing"); 
                        }
                } else {
                        setView("landing");
                }
            } catch (error) {
                console.error("[landing] initSystem error", error);
                setInitError("Terjadi kesalahan saat inisialisasi. Lihat console untuk detail.");
            } finally {
                setIsChecking(false);
            }
        };

        const channel = supabase
            .channel("landing-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "event_settings" },
                () => scheduleRefetch("event_settings")
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "event_campuses" },
                () => scheduleRefetch("event_campuses")
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "event_rundown" },
                () => scheduleRefetch("event_rundown")
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "event_highlights" },
                () => scheduleRefetch("event_highlights")
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "event_faq" },
                () => scheduleRefetch("event_faq")
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "participants" },
                () => scheduleRefetch("participants")
            )
            .subscribe((status) => {
                console.debug("[landing] realtime status", status);
            });

        void initSystem();

        return () => {
            isCancelled = true;
            if (refetchTimer) window.clearTimeout(refetchTimer);
            supabase.removeChannel(channel);
        };
  }, []);

  // --- REGISTRATION LOGIC ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    
    // Check Duplicate
    const { data: existing } = await supabase
        .from("participants")
        .select("id")
        .or(`email.eq.${formData.email},phone.eq.${formData.phone}`)
        .maybeSingle();
        
    if (existing) { 
        showNotify("Email atau Nomor HP ini sudah terdaftar!", "error"); 
        setLoading(false); 
        return; 
    }
    
    // Insert Data
    const { data, error } = await supabase
        .from("participants")
        .insert([formData])
        .select()
        .single();
        
    if (error) { 
        showNotify("Gagal Registrasi: " + error.message, "error"); 
        setLoading(false); 
    } else { 
        localStorage.setItem("smkn1_expo_ticket_id", data.id); 
        setTicketData(data); 
        
        // Fake delay for UX
        setTimeout(() => { 
            setLoading(false); 
            setView("ticket"); 
        }, 1500); 
    }
  };

  const resetDevice = () => { 
      if(confirm("Apakah Anda yakin ingin mereset perangkat ini? Data tiket akan hilang dari browser ini.")) { 
          localStorage.removeItem("smkn1_expo_ticket_id"); 
          window.location.reload(); 
      } 
  }

  // --- CERTIFICATE CHECK LOGIC ---
  const openCertificate = useCallback(() => {
      setCertificateTicketCode("");
      setCertificateParticipant(null);
      setCertificateOverlayOpen(false);
      setCertificateReturnView("certificate");
      setView("certificate");
  }, []);

  const openTicket = useCallback(() => {
      if (!ticketData) return;
      setView("ticket");
  }, [ticketData]);

  const openMyCertificateFromTicket = useCallback(async () => {
      if (!ticketData?.id) return;

      try {
          setCertificateChecking(true);
          setCertificateParticipant(null);

          const { data, error } = await supabase
              .from("participants")
              .select("*")
              .eq("id", ticketData.id)
              .eq("ticket_code", ticketData.ticket_code)
              .eq("status", "CHECKED-IN")
              .maybeSingle();

          if (error) {
              showNotify("Gagal memuat sertifikat: " + error.message, "error");
              return;
          }

          if (!data) {
              showNotify("Sertifikat belum tersedia. Pastikan sudah CHECKED-IN.", "error");
              return;
          }

          setCertificateReturnView("ticket");
          setCertificateParticipant(data);
          setCertificateOverlayOpen(true);
      } catch (err: any) {
          showNotify("Gagal memuat sertifikat. Coba lagi.", "error");
          console.error("[certificate] openMyCertificateFromTicket error", err);
      } finally {
          setCertificateChecking(false);
      }
  }, [ticketData, showNotify]);

  const handleCheckCertificate = useCallback(async (e: React.FormEvent) => {
      e.preventDefault();

      const normalized = String(certificateTicketCode ?? "").trim();
      if (!normalized) {
          showNotify("Masukkan Ticket Code / UUID terlebih dahulu.", "error");
          return;
      }

      try {
          setCertificateChecking(true);
          setCertificateParticipant(null);

          const { data, error } = await supabase
              .from("participants")
              // Select full row so we can optionally support manual certificate numbering fields
              // (e.g. participants.certificate_no) without breaking older schemas.
              .select("*")
              .eq("ticket_code", normalized)
              .eq("status", "CHECKED-IN")
              .maybeSingle();

          if (error) {
              showNotify("Gagal cek sertifikat: " + error.message, "error");
              return;
          }

          if (!data) {
              showNotify("Sertifikat tidak valid atau peserta belum check-in.", "error");
              return;
          }

          setCertificateReturnView("certificate");
          setCertificateParticipant(data);
          setCertificateOverlayOpen(true);
      } catch (err: any) {
          showNotify("Gagal cek sertifikat. Coba lagi.", "error");
          console.error("[certificate] handleCheckCertificate error", err);
      } finally {
          setCertificateChecking(false);
      }
  }, [certificateTicketCode, showNotify]);

  // --- RENDER LOADING ---
  if (isChecking) return (
    <div className="min-h-dvh bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <Loader2 className="w-16 h-16 text-cyan-600 animate-spin relative z-10 drop-shadow-xl"/>
        <p className="mt-6 text-sm font-bold text-slate-400 tracking-[0.5em] animate-pulse relative z-10">SYSTEM INITIALIZING</p>
    </div>
  );

    if (initError) {
        return (
            <div className="min-h-dvh bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden p-6 text-center">
                <div className="absolute inset-0 bg-grid-slate-200 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                <div className="relative z-10 max-w-xl">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-3">Gagal Memuat Data</h1>
                    <p className="text-slate-500 leading-relaxed mb-8">{initError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold shadow-xl hover:bg-slate-800 transition-colors"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

  // --- RENDER MAINTENANCE (BARU) ---
  if (view === "maintenance") return <MaintenanceScreen mode={siteMode} />;

  return (
    <main className="min-h-dvh font-sans text-slate-800 relative selection:bg-cyan-200 selection:text-cyan-900">
            <div className="print:hidden">
                <TechBackground />
            </div>
      
      {/* 1. ANNOUNCEMENT BAR */}
      {view !== "ticket" && config.announcement && (
        <motion.div 
            initial={{ y: -50 }} 
            animate={{ y: 0 }} 
                        className="print:hidden bg-slate-900 text-white text-xs font-bold py-3 text-center sticky top-0 z-60 shadow-xl flex items-center justify-center gap-3 tracking-wide"
        >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="opacity-90">INFO TERBARU:</span> {config.announcement}
        </motion.div>
      )}
      
      {/* 2. NAVBAR */}
      {view !== "ticket" && (
                <nav className="print:hidden sticky top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 h-20 md:h-24 transition-all pt-[env(safe-area-inset-top)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-4">
                <div 
                    className="flex items-center gap-3 font-black text-2xl tracking-tighter cursor-pointer group select-none" 
                    onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                >
                    <div className="w-12 h-12 bg-linear-to-tr from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:rotate-12 transition-transform duration-300">
                        {config.event_logo_url ? (
                            <img
                                src={config.event_logo_url}
                                alt="Event Logo"
                                className="w-8 h-8 object-contain"
                            />
                        ) : (
                            <Cpu className="w-7 h-7"/>
                        )}
                    </div>
                    <span className="text-slate-900 text-xl sm:text-2xl md:text-3xl whitespace-nowrap">EXPO<span className="text-cyan-600">SMKN1</span></span>
                </div>

                <div className="flex items-center gap-3">
                    {ticketData && (
                        <button
                            type="button"
                            onClick={openTicket}
                            className="hidden md:flex px-6 py-4 rounded-full font-bold transition-all shadow-xl hover:-translate-y-1 items-center gap-3 text-sm border bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        >
                            <Ticket className="w-4 h-4" />
                            E-Ticket Saya
                        </button>
                    )}

                    {ticketData && (
                        <button
                            type="button"
                            onClick={openTicket}
                            className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50"
                            aria-label="E-Ticket Saya"
                            title="E-Ticket Saya"
                        >
                            <Ticket className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={openCertificate}
                        className={`hidden md:flex px-6 py-4 rounded-full font-bold transition-all shadow-xl hover:-translate-y-1 items-center gap-3 text-sm border ${
                            view === "certificate"
                                ? "bg-cyan-600 text-white border-cyan-600 shadow-cyan-500/30"
                                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                    >
                        <Ticket className="w-4 h-4" />
                        Cek E-Sertifikat
                    </button>

                    <button
                        type="button"
                        onClick={openCertificate}
                        className={`md:hidden inline-flex items-center justify-center h-11 w-11 rounded-full border shadow-sm ${
                            view === "certificate"
                                ? "bg-cyan-600 text-white border-cyan-600"
                                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                        }`}
                        aria-label="Cek E-Sertifikat"
                        title="Cek E-Sertifikat"
                    >
                        <Award className="w-5 h-5" />
                    </button>

                    {view === "landing" && (
                        <button 
                            onClick={() => config.status === "CLOSED" ? showNotify("Mohon maaf, pendaftaran saat ini sedang ditutup!", "error") : setView("register")} 
                            className={`hidden md:flex px-8 py-4 rounded-full font-bold transition-all shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-1 items-center gap-3 text-sm ${
                                config.status === "CLOSED" 
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                                : "bg-slate-900 text-white hover:bg-cyan-600"
                            }`}
                        >
                            {config.status === "CLOSED" ? <Lock className="w-4 h-4"/> : <Sparkles className="w-4 h-4"/>}
                            {config.status === "CLOSED" ? "Pendaftaran Ditutup" : "Daftar Sekarang"}
                        </button>
                    )}

                    {view === "landing" && (
                        <button
                            type="button"
                            onClick={() =>
                                config.status === "CLOSED"
                                    ? showNotify("Mohon maaf, pendaftaran saat ini sedang ditutup!", "error")
                                    : setView("register")
                            }
                            className={`md:hidden inline-flex items-center justify-center h-11 w-11 rounded-full border shadow-sm ${
                                config.status === "CLOSED"
                                    ? "bg-slate-200 text-slate-400 border-slate-200"
                                    : "bg-slate-900 text-white border-slate-900 hover:bg-cyan-600 hover:border-cyan-600"
                            }`}
                            aria-label={config.status === "CLOSED" ? "Pendaftaran Ditutup" : "Daftar Sekarang"}
                            title={config.status === "CLOSED" ? "Pendaftaran Ditutup" : "Daftar Sekarang"}
                        >
                            {config.status === "CLOSED" ? <Lock className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                        </button>
                    )}
                </div>
            </div>
        </nav>
      )}

      <AnimatePresence mode="wait">
        
        {/* === VIEW 1: LANDING PAGE === */}
        {view === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            {/* HERO SECTION */}
                        <section className="relative pt-8 md:pt-12 pb-20 md:pb-32 px-4 md:px-6 max-w-7xl mx-auto min-h-[80vh] md:min-h-[90vh] flex flex-col justify-center overflow-visible">
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                  
                  {/* HERO TEXT */}
                  <motion.div style={{ y: yHero, opacity: opacityHero }} className="relative z-10">
                      <motion.div 
                          variants={fadeUpVariant}
                          initial="hidden"
                          animate="visible"
                          className="inline-flex flex-wrap items-center gap-2 px-5 py-2.5 bg-white/60 border border-white rounded-full text-cyan-700 text-xs font-bold mb-8 backdrop-blur-sm shadow-sm ring-1 ring-cyan-100 max-w-full"
                      >
                          <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                          </span>
                          Official Event SMKN 1 Kademangan
                      </motion.div>
                      
                      <motion.h1 
                          initial={{ opacity: 0, y: 30 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }} 
                          className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black text-slate-900 leading-[0.98] sm:leading-[0.92] md:leading-[0.9] mb-6 md:mb-8 tracking-tighter wrap-break-word"
                      >
                          {config.hero_title}
                      </motion.h1>
                      
                      <motion.p 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          transition={{ delay: 0.4 }} 
                          className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 md:mb-10 max-w-lg leading-relaxed border-l-4 border-cyan-500 pl-5 md:pl-6"
                      >
                          {config.hero_subtitle}
                      </motion.p>
                      
                      <motion.div 
                          initial={{ opacity: 0, y: 20 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: 0.6 }} 
                          className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
                      >
                          <button 
                              onClick={() => config.status === "CLOSED" ? showNotify("Mohon maaf, pendaftaran saat ini sedang ditutup.", "error") : setView("register")} 
                              className={`w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3 ${config.status === "CLOSED" ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white group"}`}
                          >
                              {config.status === "CLOSED" ? "Pendaftaran Ditutup" : config.hero_btn_text}
                              {config.status !== "CLOSED" && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>}
                          </button>
                          
                          <div className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 md:px-8 py-4 md:py-5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold shadow-sm">
                               <Calendar className="w-5 h-5 text-cyan-500"/> 
                               {config.event_date}
                          </div>
                      </motion.div>
                      
                      {/* STATS COUNTER REAL-TIME */}
                      <div className="mt-12 md:mt-20 flex flex-wrap gap-8 md:gap-12 border-t border-slate-200 pt-8 md:pt-10">
                          <div>
                              <div className="text-4xl sm:text-5xl font-black text-slate-900 flex items-baseline">
                                  <Counter to={realCounts.campuses}/><span className="text-cyan-600 text-2xl sm:text-3xl ml-1">+</span>
                              </div>
                              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">Kampus</div>
                          </div>
                          <div>
                              <div className="text-4xl sm:text-5xl font-black text-slate-900 flex items-baseline">
                                  <Counter to={realCounts.participants}/><span className="text-cyan-600 text-2xl sm:text-3xl ml-1">+</span>
                              </div>
                              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">Peserta</div>
                          </div>
                          <div>
                              <div className="text-4xl sm:text-5xl font-black text-slate-900 flex items-baseline">
                                  <Counter to={parseInt(config.stats_speakers || 0)}/>
                              </div>
                              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">Speakers</div>
                          </div>
                      </div>
                  </motion.div>

                  {/* 3D ILLUSTRATION */}
                  <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      transition={{ duration: 1 }} 
                      className="relative hidden md:block perspective-1000" 
                      style={{ height: "650px" }}
                  >
                      <motion.div 
                          animate={{ y: [0, -30, 0], rotateX: [0, 5, 0], rotateY: [0, 5, 0] }} 
                          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} 
                          className="absolute inset-0 bg-linear-to-br from-cyan-500 to-blue-700 rounded-[3rem] shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white/20"
                      >
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-white/20 blur-[120px] rounded-full"></div>
                          
                          <div className="relative z-10 text-center text-white p-10">
                              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 mb-6 inline-block shadow-2xl">
                                  <Cpu className="w-32 h-32 text-white drop-shadow-lg" />
                              </div>
                              <h3 className="text-5xl font-black mb-3 tracking-tight">Society 5.0</h3>
                              <p className="text-cyan-100 text-xl font-medium tracking-wide">Integrated Education Ecosystem</p>
                          </div>
                          
                          {/* Floating Elements */}
                          <motion.div animate={{ x: [0, 30, 0], y: [0, 30, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-24 right-12 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg"><Globe className="text-white w-10 h-10"/></motion.div>
                          <motion.div animate={{ x: [0, -30, 0], y: [0, -30, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute bottom-24 left-12 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg"><Zap className="text-yellow-300 w-10 h-10"/></motion.div>
                      </motion.div>
                  </motion.div>
              </div>
            </section>

            {/* MARQUEE SECTION */}
            <CampusMarquee items={campuses} />

            {/* VIDEO TEASER SECTION (WITH INTERACTION) */}
            <motion.section 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                variants={fadeUpVariant} 
                className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto"
            >
                <motion.div style={{ y: yVideo }} className="relative">
                    <div 
                        onClick={() => youtubeId ? setVideoOpen(true) : showNotify("Video belum tersedia.", "error")}
                        className="bg-slate-900 rounded-[3.5rem] overflow-hidden relative min-h-[70vh] md:min-h-screen flex items-center justify-center group cursor-pointer shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-cyan-900 via-slate-900 to-purple-900 opacity-90 transition-opacity group-hover:opacity-95"></div>
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-[1.5s]"
                            style={youtubeThumbnailUrl ? { backgroundImage: `url(${youtubeThumbnailUrl})` } : undefined}
                        ></div>
                        
                        <div className="relative z-10 text-center p-6 sm:p-10">
                            <motion.div 
                                whileHover={{ scale: 1.2, rotate: 90 }} 
                                className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 mb-6 sm:mb-8 mx-auto group-hover:bg-cyan-500/80 group-hover:border-cyan-400 transition-all duration-300"
                            >
                                <PlayCircle className="w-10 h-10 sm:w-14 sm:h-14 text-white ml-2 fill-white/20" />
                            </motion.div>
                            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 md:mb-6 tracking-tighter">{config.youtube_video_title || 'AFTERMOVIE'}</h2>
                            <p className="text-slate-300 text-lg sm:text-xl md:text-2xl font-light">Saksikan keseruan tahun lalu & rasakan atmosfernya.</p>
                        </div>
                    </div>
                </motion.div>
            </motion.section>

            {/* QUOTE SECTION */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <Quote className="w-20 h-20 text-cyan-100 mx-auto mb-10" />
                    <motion.h3 
                        initial="hidden" 
                        whileInView="visible" 
                        variants={fadeUpVariant} 
                        className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-12 italic"
                    >
                        "{config.headmaster_quote}"
                    </motion.h3>
                    <div className="inline-flex items-center gap-6 bg-slate-50 px-8 py-4 rounded-full border border-slate-100 shadow-sm">
                        <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg text-white">
                            <Mic className="w-8 h-8"/>
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-slate-900 text-xl">{config.headmaster_name}</div>
                            <div className="text-cyan-600 font-bold text-sm tracking-wider uppercase">Kepala SMKN 1 Kademangan</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENTO GRID AGENDA */}
            <section className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <span className="text-cyan-600 font-bold tracking-widest uppercase text-sm">Highlights</span>
                    <h2 className="text-4xl font-black text-slate-900 mt-2">Agenda Utama</h2>
                </div>
                <motion.div 
                    initial="hidden" 
                    whileInView="visible" 
                    variants={staggerContainer} 
                    className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 h-auto lg:h-96"
                >
                    <motion.div variants={fadeUpVariant} className="lg:col-span-2 lg:row-span-2 rounded-[2.5rem] bg-white border border-slate-200 p-6 md:p-10 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-50 rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <span className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">Highlight Utama</span>
                            <h3 className="text-4xl font-black mb-4 mt-4 text-slate-900">{highlights?.[0]?.title}</h3>
                            <p className="text-slate-500 text-lg leading-relaxed">{highlights?.[0]?.description}</p>
                        </div>
                        <div className="relative z-10 mt-12 flex -space-x-4">
                            {[1,2,3].map(i=><div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 shadow-md">User</div>)}
                            <div className="w-14 h-14 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-md">+50</div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUpVariant} className="lg:col-span-2 rounded-[2.5rem] bg-slate-900 text-white p-6 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl group-hover:bg-purple-600/50 transition-colors"></div>
                        <div className="relative z-10 max-w-xs">
                            <h3 className="text-3xl font-bold mb-3">{highlights?.[1]?.title}</h3>
                            <p className="text-slate-300">{highlights?.[1]?.description}</p>
                        </div>
                        <div className="w-32 h-32 relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] flex items-center justify-center">
                            <HighlightIcon name={String(highlights?.[1]?.icon || "")} className="w-32 h-32 text-yellow-400" />
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUpVariant} className="rounded-[2.5rem] bg-blue-50 border border-blue-100 p-6 md:p-8 hover:bg-blue-100 transition-colors flex flex-col justify-center">
                        <div className="w-12 h-12 bg-blue-200 text-blue-700 rounded-2xl flex items-center justify-center mb-4">
                            {highlights?.[2]?.icon ? (
                                <HighlightIcon name={String(highlights?.[2]?.icon)} className="w-6 h-6" />
                            ) : null}
                        </div>
                        <h3 className="text-xl font-bold text-blue-900 mb-2">{highlights?.[2]?.title}</h3>
                        <p className="text-blue-700/80 text-sm">{highlights?.[2]?.description}</p>
                    </motion.div>

                    <motion.div variants={fadeUpVariant} className="rounded-[2.5rem] bg-white border border-slate-200 p-6 md:p-8 flex flex-col items-center justify-center text-center hover:border-cyan-500 transition-colors group">
                        <Calendar className="w-10 h-10 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
                        <div className="text-4xl font-black text-slate-900">{typeof config.event_date === "string" ? config.event_date.split(" ")[0] : ""}</div>
                        <div className="text-slate-400 font-bold text-sm uppercase tracking-widest">{typeof config.event_date === "string" ? config.event_date.split(" ").slice(1).join(" ") : ""}</div>
                    </motion.div>
                </motion.div>
            </section>

            {/* RUNDOWN TIMELINE */}
            <section className="py-32 px-6 bg-white border-y border-slate-100 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-cyan-600 font-bold tracking-widest uppercase text-sm">Event Schedule</span>
                        <h2 className="text-4xl font-black text-slate-900 mt-2">RUNDOWN ACARA</h2>
                    </div>
                    <div className="relative border-l-4 border-slate-100 ml-6 md:ml-0 space-y-16">
                        {rundown.map((item, i) => (
                            <motion.div 
                                initial={{opacity:0, x:-50}} 
                                whileInView={{opacity:1, x:0}} 
                                transition={{delay: i*0.1}} 
                                key={i} 
                                className="relative pl-12 md:pl-24 group"
                            >
                                {/* Dot */}
                                <div className="absolute -left-2.75 top-0 w-6 h-6 bg-white border-4 border-cyan-500 rounded-full group-hover:scale-125 group-hover:border-slate-900 transition-all z-10 shadow-lg"></div>
                                {/* Time */}
                                <div className="absolute left-16 md:-left-30 -top-1.25 md:w-24 font-black text-2xl md:text-xl text-slate-300 group-hover:text-cyan-600 transition-colors text-right">
                                    {item.time}
                                </div>
                                {/* Content */}
                                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 group-hover:border-cyan-200 group-hover:bg-white group-hover:shadow-xl transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50 rounded-bl-[100px] -mr-5 -mt-5 transition-transform group-hover:scale-150 duration-500"></div>
                                    <h3 className="text-2xl font-bold text-slate-900 relative z-10">{item.title}</h3>
                                    <p className="text-slate-500 mt-2 text-lg relative z-10">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-32 px-6 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Pertanyaan Umum</h2>
                <div className="space-y-6">
                    {faqs.map((f, i) => (
                        <motion.div 
                            initial={{opacity:0, y:20}} 
                            whileInView={{opacity:1, y:0}} 
                            key={i} 
                            className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <button 
                                onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                                className="w-full py-6 px-8 flex justify-between items-center text-left bg-white hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-bold text-slate-800 text-lg flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-sm font-black">Q</span> 
                                    {f.question}
                                </span>
                                <div className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-transform duration-300 ${openFaq===i ? "rotate-180 bg-slate-900 text-white border-slate-900" : "text-slate-400"}`}>
                                    <ChevronDown size={18} />
                                </div>
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }} 
                                        animate={{ height: "auto", opacity: 1 }} 
                                        exit={{ height: 0, opacity: 0 }} 
                                        className="bg-slate-50 border-t border-slate-100"
                                    >
                                        <div className="p-8 text-slate-600 leading-relaxed text-lg">
                                            {f.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FOOTER CTA */}
            <section className="py-20 sm:py-28 md:py-32 px-4 sm:px-6 bg-slate-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                
                <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 sm:mb-8 tracking-tight">Siap Bergabung?</h2>
                    <p className="text-slate-400 mb-10 sm:mb-12 text-base sm:text-xl md:text-2xl font-light">Kuota tiket terbatas. Amankan posisimu di era baru pendidikan vokasi sekarang juga.</p>
                    
                    <button 
                        onClick={() => config.status === "CLOSED" ? showNotify("Mohon maaf, pendaftaran saat ini sedang ditutup.", "error") : setView("register")} 
                        className={`w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-6 rounded-full font-bold text-base sm:text-xl shadow-2xl transition-all transform hover:scale-105 ${config.status === "CLOSED" ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-linear-to-r from-cyan-500 to-blue-600 text-white ring-4 ring-cyan-500/30 hover:ring-cyan-500/50"}`}
                    >
                        {config.status === "CLOSED" ? "Pendaftaran Ditutup" : "Daftarkan Diriku Sekarang"}
                    </button>
                    
                    <div className="mt-20 pt-10 border-t border-slate-800/50 flex justify-center gap-10 text-slate-500">
                        <Instagram className="w-8 h-8 hover:text-white cursor-pointer transition-colors hover:scale-110 transform" />
                        <Globe className="w-8 h-8 hover:text-white cursor-pointer transition-colors hover:scale-110 transform" />
                    </div>
                    <p className="mt-8 text-slate-600 text-sm font-mono">© 2025 SMKN 1 Kademangan Expo Team. All Rights Reserved.</p>
                </motion.div>
            </section>
          </motion.div>
        )}

        {/* === VIEW 2: REGISTER FORM (POPUP GLASS) === */}
        {view === "register" && (
          <motion.div 
            key="register" 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }} 
                        className="fixed inset-0 z-100 bg-slate-900/80 backdrop-blur-md flex items-end md:items-center justify-center px-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] md:p-6"
          >
             <div className="w-full max-w-lg bg-white p-6 sm:p-8 md:p-10 md:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl h-[95dvh] md:h-auto overflow-y-auto relative border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900">Registrasi</h2>
                        <p className="text-slate-500 text-sm">Isi data diri dengan benar.</p>
                    </div>
                    <button onClick={() => setView("landing")} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors text-xl">✕</button>
                </div>
                
                <div className="bg-blue-50 p-4 sm:p-6 rounded-2xl mb-8 flex gap-4 items-start border border-blue-100 shadow-inner">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Lock size={20}/></div>
                    <p className="text-sm text-blue-800 font-medium leading-relaxed">
                        <strong className="block mb-1 text-blue-900">Device Lock System</strong>
                        Tiket akan terkunci otomatis di perangkat ini setelah mendaftar. Pastikan Anda menggunakan HP pribadi.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    {["Name", "School Origin", "Email", "Phone"].map((l, i) => (
                       <div key={i}>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">{l}</label>
                         <input 
                            required 
                            type={l==="Email"?"email":"text"} 
                            placeholder={`Masukkan ${l}`}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-cyan-500 focus:bg-white transition-all placeholder:font-normal placeholder:text-slate-300" 
                            onChange={e => setFormData({...formData, [l==="Name"?"name":l==="School Origin"?"origin_school":l==="Email"?"email":"phone"]: e.target.value})} 
                         />
                       </div>
                    ))}
                    <button 
                        disabled={loading} 
                        className="w-full mt-8 bg-slate-900 text-white font-bold py-5 rounded-2xl flex justify-center items-center gap-3 hover:bg-cyan-600 transition-all shadow-xl disabled:opacity-70 transform hover:scale-[1.02]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Konfirmasi & Dapatkan Tiket <ArrowRight size={20}/></>}
                    </button>
                </form>
             </div>
          </motion.div>
        )}

        {/* === VIEW 2.5: CERTIFICATE CHECK (NEW FEATURE) === */}
        {view === "certificate" && (
          <motion.div
            key="certificate"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
                        className="fixed inset-0 z-120 bg-slate-900/70 backdrop-blur-md flex items-start md:items-center justify-center px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-8 overflow-y-auto print:static print:inset-auto print:bg-white print:p-0 print:backdrop-blur-0"
          >
              <div className="w-full max-w-6xl">
                  <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden">
                                            <div className="print:hidden p-6 sm:p-8 md:p-10 border-b border-slate-100 flex items-start md:items-center justify-between gap-6">
                          <div>
                              <div className="text-xs font-black tracking-[0.35em] uppercase text-cyan-700">
                                  Verification Portal
                              </div>
                              <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                  Cek Sertifikat
                              </h2>
                              <p className="mt-2 text-slate-500 font-medium">
                                  Masukkan Ticket Code / UUID. Sertifikat hanya tersedia setelah peserta berhasil check-in.
                              </p>
                          </div>
                          <button
                              type="button"
                              onClick={() => {
                                  setCertificateOverlayOpen(false);
                                  setCertificateParticipant(null);
                                  setView("landing");
                              }}
                              className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black hover:bg-red-50 hover:text-red-600 transition-colors"
                              aria-label="Tutup"
                          >
                              ✕
                          </button>
                      </div>

                      <div className="p-6 sm:p-8 md:p-10">
                          <form onSubmit={handleCheckCertificate} className="print:hidden grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
                              <div>
                                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                      Ticket Code / UUID
                                  </label>
                                  <input
                                      value={certificateTicketCode}
                                      onChange={(e) => setCertificateTicketCode(e.target.value)}
                                      placeholder="Contoh: 550e8400-e29b-41d4-a716-446655440000"
                                      className="w-full px-5 sm:px-6 py-4 sm:py-5 rounded-2xl border-2 border-slate-200 bg-slate-50 font-black text-slate-900 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:font-semibold placeholder:text-slate-300"
                                  />
                              </div>

                              <button
                                  type="submit"
                                  disabled={certificateChecking}
                                  className="h-14 sm:h-16 px-8 rounded-2xl bg-slate-900 text-white font-black shadow-xl hover:bg-cyan-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-3"
                              >
                                  {certificateChecking ? (
                                      <>
                                          <Loader2 className="animate-spin" />
                                          MEMERIKSA...
                                      </>
                                  ) : (
                                      <>
                                          <CheckCircle className="w-5 h-5" />
                                          CEK SERTIFIKAT
                                      </>
                                  )}
                              </button>
                          </form>

                          <div className="mt-10">
                              {!certificateParticipant && (
                                  <div className="print:hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10 text-center">
                                      <div className="w-20 h-20 rounded-3xl bg-cyan-50 text-cyan-700 flex items-center justify-center mx-auto mb-6 border border-cyan-100">
                                          <Ticket className="w-10 h-10" />
                                      </div>
                                      <div className="text-xl font-black text-slate-900">Masukkan kode untuk melihat sertifikat</div>
                                      <div className="mt-2 text-slate-500 font-medium">
                                          Pastikan peserta sudah scan masuk (CHECKED-IN).
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </motion.div>
        )}

        {/* === VIEW 3: TICKET (DIGITAL PASS - ULTRA DETAIL) === */}
        {view === "ticket" && ticketData && (
          <motion.div 
            key="ticket" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
                                                className="fixed inset-0 z-200 bg-slate-100 flex flex-col items-center justify-center px-4 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] print:hidden"
          >
             <div className="w-full max-w-sm flex justify-end mb-4">
                <button
                    type="button"
                    onClick={() => setView("landing")}
                    className="text-slate-700 hover:text-red-600 font-bold bg-white/80 px-4 py-2 rounded-lg border border-slate-200"
                >
                    <X className="w-4 h-4 inline-block mr-2" />
                    Tutup
                </button>
             </div>

                 <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 relative transform transition-transform hover:scale-[1.01] duration-500">
                {/* Holographic Top */}
                     <div className="bg-linear-to-br from-cyan-600 via-blue-600 to-purple-600 p-6 sm:p-10 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-4 border border-white/30 shadow-lg">
                            <Star className="w-3 h-3 text-yellow-300 fill-yellow-300"/> VIP Access Pass
                        </div>
                        <h2 className="text-3xl font-black tracking-wide drop-shadow-md">E-TICKET</h2>
                        <p className="text-cyan-100 text-xs mt-2 font-medium tracking-widest opacity-90">SMKN 1 KADEMANGAN EXPO 5.0</p>
                    </div>
                </div>

                <div className="p-6 sm:p-10 flex flex-col items-center gap-8 relative bg-white">
                    {/* Hiasan Bolong Tiket */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-slate-100 rounded-full shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.1)]"></div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-slate-100 rounded-full shadow-[inset_2px_-2px_5px_rgba(0,0,0,0.1)]"></div>

                    {/* QR Code Area */}
                                        <div className="scale-[0.92] sm:scale-100 origin-top p-4 border-2 border-dashed border-slate-300 rounded-3xl relative group cursor-pointer bg-slate-50 shadow-inner">
                      {/* Menggunakan ticket_code (UUID) jika ada, kalau tidak pakai ID biasa */}
<QRCodeSVG value={ticketData.ticket_code || `EXPO-${ticketData.id}`} size={180} />
                       {/* Scanner Line Animation */}
                       <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                          <motion.div 
                            animate={{ top: ["0%", "100%", "0%"] }} 
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }} 
                            className="absolute w-full h-1 bg-red-500 shadow-[0_0_20px_red] opacity-50" 
                          />
                       </div>
                    </div>
                    
                    <div className="text-center w-full">
                       <h3 className="text-2xl font-black text-slate-900 uppercase truncate mb-1">{ticketData.name}</h3>
                       <p className="text-cyan-600 font-bold text-sm bg-cyan-50 inline-block px-3 py-1 rounded-lg border border-cyan-100">{ticketData.origin_school}</p>
                       
                       <div className="mt-8 pt-8 border-t border-dashed border-slate-200 grid grid-cols-2 gap-8 text-center">
                           <div>
                               <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Date</div>
                               <div className="font-black text-slate-800 text-xl flex flex-col leading-none">
                                   <span>{typeof config.event_date === "string" ? config.event_date.split(" ")[0] : ""}</span>
                                   <span className="text-xs text-slate-400 font-bold">{typeof config.event_date === "string" ? config.event_date.split(" ").slice(1).join(" ") : ""}</span>
                               </div>
                           </div>
                           <div>
                               <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Gate</div>
                               <div className="font-black text-slate-800 text-xl flex flex-col leading-none">
                                   <span>MAIN</span>
                                   <span className="text-xs text-slate-400 font-bold">SMKN</span>
                               </div>
                           </div>
                       </div>
                    </div>
                </div>
                
                <div className="bg-slate-50 p-5 text-center border-t border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" /> DEVICE VERIFIED & SECURE
                    </p>
                </div>
             </div>

                 <button
                     type="button"
                     onClick={openMyCertificateFromTicket}
                     disabled={certificateChecking}
                     className="mt-6 w-full max-w-sm px-8 py-4 rounded-full bg-slate-900 text-white font-black shadow-xl hover:bg-cyan-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-3"
                 >
                     <Printer className="w-5 h-5" />
                     {certificateChecking ? "MEMUAT SERTIFIKAT..." : "UNDUH SERTIFIKAT"}
                 </button>
            
          </motion.div>
        )}

        {certificateOverlayOpen && certificateParticipant && (
            <CertificateView
                data={certificateParticipant}
                config={config}
                onClose={() => {
                    setCertificateOverlayOpen(false);
                    setCertificateParticipant(null);
                    setView(certificateReturnView);
                }}
            />
        )}

        {/* === VIDEO MODAL POPUP (FITUR BARU) === */}
        {videoOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))]"
            onClick={() => setVideoOpen(false)}
          >
             <button 
               onClick={() => setVideoOpen(false)} 
                             className="absolute top-[calc(1rem+env(safe-area-inset-top))] right-[calc(1rem+env(safe-area-inset-right))] text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
             >
                <X size={32}/>
             </button>
             
             <motion.div 
               initial={{ scale: 0.9, y: 20 }} 
               animate={{ scale: 1, y: 0 }} 
               className="w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 ring-1 ring-white/20"
               onClick={(e) => e.stopPropagation()}
             >
                                {youtubeId ? (
                                    <iframe 
                                        className="w-full h-full" 
                                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&modestbranding=1&rel=0`} 
                                        title="Aftermovie" 
                                        allow="autoplay; encrypted-media" 
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/70 font-bold">
                                        Video belum tersedia
                                    </div>
                                )}
             </motion.div>
          </motion.div>
        )}

        {/* === CUSTOM NOTIFICATION POPUP (PENGGANTI ALERT) === */}
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setNotification({ ...notification, show: false })}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.8, y: 50 }} 
              className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
               {/* Background Decoration */}
               <div className={`absolute top-0 left-0 w-full h-2 ${notification.type === 'error' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
               <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 ${notification.type === 'error' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>

               {/* Icon */}
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${notification.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-cyan-50 text-cyan-600'}`}>
                  {notification.type === 'error' ? <Lock size={40} /> : <Info size={40} />}
               </div>

               {/* Text */}
               <h3 className="text-2xl font-black text-slate-900 mb-2">
                 {notification.type === 'error' ? 'Akses Ditolak' : 'Informasi'}
               </h3>
               <p className="text-slate-500 leading-relaxed mb-8">
                 {notification.message}
               </p>

               {/* Button */}
               <button 
                 onClick={() => setNotification({ ...notification, show: false })}
                 className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] shadow-lg ${notification.type === 'error' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/30'}`}
               >
                 Mengerti, Tutup
               </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}