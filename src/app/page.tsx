"use client";

import { useState, useEffect, useRef } from "react";
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
  Lock, 
  Mic, 
  X,
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

// --- 2. COMPONENT: ANIMATED COUNTER (PRECISE) ---
const Counter = ({ to }: { to: number }) => {
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
};

// --- 3. COMPONENT: BACKGROUND 5.0 (FULL DETAIL) ---
// Ini versi background yang lebih detail dengan lebih banyak layer
const TechBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 selection:bg-cyan-300 selection:text-cyan-900 pointer-events-none">
    {/* Grid Layer 1 */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px]"></div>
    
    {/* Grid Layer 2 (Larger) */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-size-[160px_160px]"></div>

    {/* Floating Orbs - Cyan */}
    <motion.div 
      animate={{ 
        x: [0, 200, 0], 
        y: [0, -100, 0], 
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3]
      }} 
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
      className="absolute top-[-10%] right-[-10%] w-200 h-200 bg-cyan-400/20 rounded-full blur-[120px] mix-blend-multiply" 
    />
    
    {/* Floating Orbs - Purple */}
    <motion.div 
      animate={{ 
        x: [0, -200, 0], 
        y: [0, 100, 0], 
        scale: [1, 1.5, 1],
        opacity: [0.3, 0.5, 0.3]
      }} 
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
      className="absolute bottom-[-10%] left-[-10%] w-200 h-200 bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply" 
    />

    {/* Floating Orbs - Center Blue (Accent) */}
    <motion.div 
      animate={{ 
        x: [0, 100, -100, 0], 
        y: [0, 50, -50, 0],
        opacity: [0, 0.2, 0]
      }} 
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
      className="absolute top-[40%] left-[40%] w-96 h-96 bg-blue-500/10 rounded-full blur-[80px]" 
    />
  </div>
);

// --- 4. COMPONENT: MAINTENANCE / COMING SOON SCREEN (BARU) ---
const MaintenanceScreen = ({ mode }: { mode: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white relative overflow-hidden p-6 text-center">
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
const CampusMarquee = ({ items }: { items: any[] }) => {
  if (!items || items.length === 0) return null;
  
  // Quadruple items for ultra smooth infinite scroll without layout shifts
  const marqueeItems = [...items, ...items, ...items, ...items];

  return (
    <section className="py-20 bg-white/80 backdrop-blur-md border-y border-slate-200 overflow-hidden relative z-20">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
             <motion.span 
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="text-cyan-600 font-bold tracking-[0.3em] uppercase text-xs block mb-3"
             >
               Official Partners & Sponsors
             </motion.span>
             <motion.h2 
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-3xl font-black text-slate-900"
             >
               Didukung Oleh Kampus Ternama
             </motion.h2>
        </div>

        <div className="w-full overflow-hidden relative group">
            {/* Fade Gradients for visual polish */}
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            
            <motion.div 
                className="flex gap-8 w-max px-6" 
                animate={{ x: [0, -2000] }} // Adjust logic based on width
                transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
            >
                {marqueeItems.map((c, i) => (
                <div 
                  key={i} 
                  className="shrink-0 w-72 p-8 bg-white border border-slate-100 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center group/card cursor-default"
                >
                    <div className="h-24 w-full flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 bg-slate-100 rounded-full scale-0 group-hover/card:scale-100 transition-transform duration-300 opacity-20"></div>
                        {c.logo_url ? (
                           <img 
                             src={c.logo_url} 
                             alt={c.name} 
                             className="max-h-full max-w-full object-contain grayscale group-hover/card:grayscale-0 transition-all duration-500 scale-90 group-hover/card:scale-110" 
                           />
                        ) : (
                           <School className="w-16 h-16 text-slate-300 group-hover/card:text-cyan-500 transition-colors duration-300"/>
                        )}
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover/card:text-cyan-700 transition-colors">{c.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 px-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                        {c.description || "Partner resmi pendidikan."}
                    </p>
                </div>
                ))}
            </motion.div>
        </div>
    </section>
  );
};

// --- 6. MAIN PAGE COMPONENT ---
export default function Home() {
  const [isChecking, setIsChecking] = useState(true);
  const [view, setView] = useState<"landing" | "register" | "ticket" | "maintenance">("landing");
  const [siteMode, setSiteMode] = useState("LIVE"); // Default LIVE
  
  // Data State
  const [config, setConfig] = useState<any>({});
  const [campuses, setCampuses] = useState<any[]>([]);
  const [rundown, setRundown] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  
  // Real-time Counts
  const [realCounts, setRealCounts] = useState({ participants: 0, campuses: 0 });

  // UI State
  const [videoOpen, setVideoOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", origin_school: "", phone: "" });
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // --- NEW: NOTIFICATION STATE ---
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });
  
  // Helper Notifikasi
  const showNotify = (message: string, type: "info" | "error" | "success" = "info") => {
      setNotification({ show: true, message, type: type as "info" | "error" }); // Fixed type assertion
  };

  // Parallax Hooks
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);
  const yVideo = useTransform(scrollY, [500, 1000], [50, -50]);

  // --- INITIALIZATION ---
  useEffect(() => {
    const initSystem = async () => {
        try {
            // Check Local Storage for Ticket FIRST
            const savedTicketID = localStorage.getItem("smkn1_expo_ticket_id");
            
            // Fetch All Data in Parallel
            const [settingsRes, campusesRes, rundownRes, faqRes] = await Promise.all([
                supabase.from("event_settings").select("*"),
                supabase.from("event_campuses").select("*").order('id'),
                supabase.from("event_rundown").select("*").order('id'),
                supabase.from("event_faq").select("*").order('id')
            ]);
            
            // Get Exact Count from Database
            const { count: participantCount } = await supabase
                .from("participants")
                .select("*", { count: "exact", head: true });
            
            // CEK MODE SITUS (BARU)
            if (settingsRes.data?.[0]?.site_mode === 'MAINTENANCE' || settingsRes.data?.[0]?.site_mode === 'COMING_SOON') {
                setSiteMode(settingsRes.data[0].site_mode);
                setView("maintenance");
                setIsChecking(false);
                return; // Stop loading other things if maintenance
            }
            
            if (campusesRes.data) setCampuses(campusesRes.data);
            if (rundownRes.data) setRundown(rundownRes.data);
            if (faqRes.data) setFaqs(faqRes.data);
            
            setRealCounts({ 
                participants: participantCount || 0, 
                campuses: campusesRes.data?.length || 0 
            });

            // Check Local Storage for Ticket
            if (savedTicketID) {
                const { data } = await supabase
                    .from("participants")
                    .select("*")
                    .eq("id", savedTicketID)
                    .single();
                    
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
            console.error("Init Error:", error); 
        } finally { 
            setIsChecking(false); 
        }
    };
    initSystem();
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

  // --- RENDER LOADING ---
  if (isChecking) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <Loader2 className="w-16 h-16 text-cyan-600 animate-spin relative z-10 drop-shadow-xl"/>
        <p className="mt-6 text-sm font-bold text-slate-400 tracking-[0.5em] animate-pulse relative z-10">SYSTEM INITIALIZING</p>
    </div>
  );

  // --- RENDER MAINTENANCE (BARU) ---
  if (view === "maintenance") return <MaintenanceScreen mode={siteMode} />;

  return (
    <main className="min-h-screen font-sans text-slate-800 relative selection:bg-cyan-200 selection:text-cyan-900">
      <TechBackground />
      
      {/* 1. ANNOUNCEMENT BAR */}
      {view !== "ticket" && config.announcement && (
        <motion.div 
            initial={{ y: -50 }} 
            animate={{ y: 0 }} 
            className="bg-slate-900 text-white text-xs font-bold py-3 text-center sticky top-0 z-60 shadow-xl flex items-center justify-center gap-3 tracking-wide"
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
        <nav className="sticky top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 h-24 transition-all">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <div 
                    className="flex items-center gap-3 font-black text-2xl tracking-tighter cursor-pointer group select-none" 
                    onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                >
                    <div className="w-12 h-12 bg-linear-to-tr from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:rotate-12 transition-transform duration-300">
                        <Cpu className="w-7 h-7"/>
                    </div>
                    <span className="text-slate-900 text-3xl">EXPO<span className="text-cyan-600">SMKN1</span></span>
                </div>
                
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
            </div>
        </nav>
      )}

      <AnimatePresence mode="wait">
        
        {/* === VIEW 1: LANDING PAGE === */}
        {view === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            {/* HERO SECTION */}
            <section className="relative pt-12 pb-32 px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center overflow-visible">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                  
                  {/* HERO TEXT */}
                  <motion.div style={{ y: yHero, opacity: opacityHero }} className="relative z-10">
                      <motion.div 
                          variants={fadeUpVariant}
                          initial="hidden"
                          animate="visible"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 border border-white rounded-full text-cyan-700 text-xs font-bold mb-8 backdrop-blur-sm shadow-sm ring-1 ring-cyan-100"
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
                          className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter"
                      >
                          {config.hero_title || "LOADING..."}
                      </motion.h1>
                      
                      <motion.p 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          transition={{ delay: 0.4 }} 
                          className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed border-l-4 border-cyan-500 pl-6"
                      >
                          {config.hero_subtitle || "Mohon tunggu sebentar..."}
                      </motion.p>
                      
                      <motion.div 
                          initial={{ opacity: 0, y: 20 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: 0.6 }} 
                          className="flex flex-wrap gap-4"
                      >
                          <button 
                              onClick={() => config.status === "CLOSED" ? showNotify("Mohon maaf, pendaftaran saat ini sedang ditutup.", "error") : setView("register")} 
                              className={`px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all hover:scale-105 flex items-center gap-3 ${config.status === "CLOSED" ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white group"}`}
                          >
                              {config.status === "CLOSED" ? "Pendaftaran Ditutup" : config.hero_btn_text || "Ambil Tiket"}
                              {config.status !== "CLOSED" && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>}
                          </button>
                          
                          <div className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold shadow-sm">
                               <Calendar className="w-5 h-5 text-cyan-500"/> 
                               {config.event_date?.split(" ")[0] || "20"} {config.event_date?.split(" ")[1] || "MEI 2025"}
                          </div>
                      </motion.div>
                      
                      {/* STATS COUNTER REAL-TIME */}
                      <div className="mt-20 flex flex-wrap gap-12 border-t border-slate-200 pt-10">
                          <div>
                              <div className="text-5xl font-black text-slate-900 flex items-baseline">
                                  <Counter to={realCounts.campuses}/><span className="text-cyan-600 text-3xl ml-1">+</span>
                              </div>
                              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">Kampus</div>
                          </div>
                          <div>
                              <div className="text-5xl font-black text-slate-900 flex items-baseline">
                                  <Counter to={realCounts.participants}/><span className="text-cyan-600 text-3xl ml-1">+</span>
                              </div>
                              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">Peserta</div>
                          </div>
                          <div>
                              <div className="text-5xl font-black text-slate-900 flex items-baseline">
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
                className="py-32 px-6 max-w-7xl mx-auto"
            >
                <motion.div style={{ y: yVideo }} className="relative">
                    <div 
                        onClick={() => setVideoOpen(true)}
                        className="bg-slate-900 rounded-[3.5rem] overflow-hidden relative min-h-screen flex items-center justify-center group cursor-pointer shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-cyan-900 via-slate-900 to-purple-900 opacity-90 transition-opacity group-hover:opacity-95"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-[1.5s]"></div>
                        
                        <div className="relative z-10 text-center p-10">
                            <motion.div 
                                whileHover={{ scale: 1.2, rotate: 90 }} 
                                className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 mb-8 mx-auto group-hover:bg-cyan-500/80 group-hover:border-cyan-400 transition-all duration-300"
                            >
                                <PlayCircle className="w-14 h-14 text-white ml-2 fill-white/20" />
                            </motion.div>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">AFTERMOVIE 2024</h2>
                            <p className="text-slate-300 text-2xl font-light">Saksikan keseruan tahun lalu & rasakan atmosfernya.</p>
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
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <span className="text-cyan-600 font-bold tracking-widest uppercase text-sm">Highlights</span>
                    <h2 className="text-4xl font-black text-slate-900 mt-2">Agenda Utama</h2>
                </div>
                <motion.div 
                    initial="hidden" 
                    whileInView="visible" 
                    variants={staggerContainer} 
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-96"
                >
                    <motion.div variants={fadeUpVariant} className="md:col-span-2 md:row-span-2 rounded-[2.5rem] bg-white border border-slate-200 p-10 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-50 rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <span className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">Highlight Utama</span>
                            <h3 className="text-4xl font-black mb-4 mt-4 text-slate-900">Talkshow Industri</h3>
                            <p className="text-slate-500 text-lg leading-relaxed">Diskusi panel eksklusif bersama HRD perusahaan multinasional dan alumni sukses. Pelajari skill yang paling dicari tahun 2025.</p>
                        </div>
                        <div className="relative z-10 mt-12 flex -space-x-4">
                            {[1,2,3].map(i=><div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 shadow-md">User</div>)}
                            <div className="w-14 h-14 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-md">+50</div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUpVariant} className="md:col-span-2 rounded-[2.5rem] bg-slate-900 text-white p-10 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl group-hover:bg-purple-600/50 transition-colors"></div>
                        <div className="relative z-10 max-w-xs">
                            <h3 className="text-3xl font-bold mb-3">Grand Doorprize</h3>
                            <p className="text-slate-300">Laptop Gaming, Tablet Grafis & Beasiswa Pendidikan Full Cover.</p>
                        </div>
                        <Award className="w-32 h-32 text-yellow-400 relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                    </motion.div>

                    <motion.div variants={fadeUpVariant} className="rounded-[2.5rem] bg-blue-50 border border-blue-100 p-8 hover:bg-blue-100 transition-colors flex flex-col justify-center">
                        <div className="w-12 h-12 bg-blue-200 text-blue-700 rounded-2xl flex items-center justify-center mb-4"><Sparkles size={24}/></div>
                        <h3 className="text-xl font-bold text-blue-900 mb-2">Konsultasi Gratis</h3>
                        <p className="text-blue-700/80 text-sm">Psikotes minat bakat di tempat.</p>
                    </motion.div>

                    <motion.div variants={fadeUpVariant} className="rounded-[2.5rem] bg-white border border-slate-200 p-8 flex flex-col items-center justify-center text-center hover:border-cyan-500 transition-colors group">
                        <Calendar className="w-10 h-10 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
                        <div className="text-4xl font-black text-slate-900">{config.event_date?.split(" ")[0] || "20"}</div>
                        <div className="text-slate-400 font-bold text-sm uppercase tracking-widest">{config.event_date?.split(" ")[1] || "MEI 2025"}</div>
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
            <section className="py-32 px-6 bg-slate-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                
                <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">Siap Bergabung?</h2>
                    <p className="text-slate-400 mb-12 text-2xl font-light">Kuota tiket terbatas. Amankan posisimu di era baru pendidikan vokasi sekarang juga.</p>
                    
                    <button 
                        onClick={() => config.status === "CLOSED" ? showNotify("Mohon maaf, pendaftaran saat ini sedang ditutup.", "error") : setView("register")} 
                        className={`px-16 py-6 rounded-full font-bold text-xl shadow-2xl transition-all transform hover:scale-105 ${config.status === "CLOSED" ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-linear-to-r from-cyan-500 to-blue-600 text-white ring-4 ring-cyan-500/30 hover:ring-cyan-500/50"}`}
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
            className="fixed inset-0 z-100 bg-slate-900/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6"
          >
             <div className="w-full max-w-lg bg-white p-8 md:p-10 md:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl h-[95vh] md:h-auto overflow-y-auto relative border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900">Registrasi</h2>
                        <p className="text-slate-500 text-sm">Isi data diri dengan benar.</p>
                    </div>
                    <button onClick={() => setView("landing")} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors text-xl">✕</button>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-2xl mb-8 flex gap-4 items-start border border-blue-100 shadow-inner">
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

        {/* === VIEW 3: TICKET (DIGITAL PASS - ULTRA DETAIL) === */}
        {view === "ticket" && ticketData && (
          <motion.div 
            key="ticket" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="fixed inset-0 z-200 bg-slate-100 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
          >
             <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 relative transform transition-transform hover:scale-[1.01] duration-500">
                {/* Holographic Top */}
                <div className="bg-linear-to-br from-cyan-600 via-blue-600 to-purple-600 p-10 text-center text-white relative overflow-hidden">
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

                <div className="p-10 flex flex-col items-center gap-8 relative bg-white">
                    {/* Hiasan Bolong Tiket */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-slate-100 rounded-full shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.1)]"></div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-slate-100 rounded-full shadow-[inset_2px_-2px_5px_rgba(0,0,0,0.1)]"></div>

                    {/* QR Code Area */}
                    <div className="p-4 border-2 border-dashed border-slate-300 rounded-3xl relative group cursor-pointer bg-slate-50 shadow-inner">
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
                                   <span>{config.event_date?.split(" ")[0] || "20"}</span>
                                   <span className="text-xs text-slate-400 font-bold">{config.event_date?.split(" ")[1] || "MEI"}</span>
                               </div>
                           </div>
                           <div>
                               <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Gate</div>
                               <div className="font-black text-slate-800 text-xl flex flex-col leading-none">
                                   <span>MAIN</span>
                                   <span className="text-xs text-slate-400 font-bold">HALL</span>
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
                onClick={resetDevice} 
                className="mt-8 px-8 py-3 rounded-full border border-slate-300 text-slate-400 text-xs font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all uppercase tracking-wider"
             >
                 Reset Device ID (Dev Mode)
             </button>
          </motion.div>
        )}

        {/* === VIDEO MODAL POPUP (FITUR BARU) === */}
        {videoOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setVideoOpen(false)}
          >
             <button 
               onClick={() => setVideoOpen(false)} 
               className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
             >
                <X size={32}/>
             </button>
             
             <motion.div 
               initial={{ scale: 0.9, y: 20 }} 
               animate={{ scale: 1, y: 0 }} 
               className="w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 ring-1 ring-white/20"
               onClick={(e) => e.stopPropagation()}
             >
                <iframe 
                  className="w-full h-full" 
                  src={`https://www.youtube.com/embed/${config.youtube_video_id || "jfKfPfyJRdk"}?autoplay=1&modestbranding=1&rel=0`} 
                  title="Aftermovie" 
                  allow="autoplay; encrypted-media" 
                  allowFullScreen
                />
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