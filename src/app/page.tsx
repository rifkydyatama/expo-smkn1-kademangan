"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, Variants } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabase"; 
import { Loader2, Sparkles, School, Ticket, Calendar, PlayCircle, Cpu, Globe, ChevronDown, CheckCircle, Instagram, ArrowRight, Star, Quote, Zap, Award, Lock, Mic, X, Info, Construction, Timer, AlertTriangle } from "lucide-react";

// --- VARIANTS ---
const fadeUpVariant: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

const getYoutubeId = (urlOrId: string) => {
    if (!urlOrId) return "jfKfPfyJRdk";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : urlOrId;
};

const Counter = ({ to }: { to: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true });
  useEffect(() => {
    if (!isInView) return;
    const duration = 1500; const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime; const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); const currentVal = Math.floor(ease * to);
      if (nodeRef.current) nodeRef.current.textContent = currentVal.toLocaleString();
      if (progress < 1) requestAnimationFrame(animate); else { if (nodeRef.current) nodeRef.current.textContent = to.toLocaleString(); }
    };
    requestAnimationFrame(animate);
  }, [to, isInView]);
  return <span ref={nodeRef} className="tabular-nums">0</span>;
};

const TechBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 selection:bg-cyan-300 selection:text-cyan-900 pointer-events-none transform-gpu">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    <motion.div animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[80px] mix-blend-multiply will-change-transform" />
    <motion.div animate={{ x: [0, -100, 0], y: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[80px] mix-blend-multiply will-change-transform" />
  </div>
);

const CampusMarquee = ({ items }: { items: any[] }) => {
  if (!items || items.length === 0) return null;
  const marqueeItems = [...items, ...items, ...items, ...items];
  return (
    <section className="py-20 bg-white/80 backdrop-blur-md border-y border-slate-200 overflow-hidden relative z-20">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center"><span className="text-cyan-600 font-bold tracking-[0.3em] uppercase text-xs block mb-3">Official Partners</span><h2 className="text-3xl font-black text-slate-900">Didukung Oleh Kampus Ternama</h2></div>
        <div className="w-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            <motion.div className="flex gap-8 w-max px-6" animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }}>{marqueeItems.map((c, i) => (<div key={i} className="flex-shrink-0 w-72 p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center"><div className="h-24 w-full flex items-center justify-center mb-6">{c.logo_url ? (<img src={c.logo_url} alt={c.name} loading="lazy" className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-500 scale-90 hover:scale-110" />) : (<School className="w-16 h-16 text-slate-300 hover:text-cyan-500 transition-colors"/>)}</div><h3 className="font-bold text-slate-800 text-lg hover:text-cyan-700 transition-colors">{c.name}</h3></div>))}</motion.div>
        </div>
    </section>
  );
};

export default function Home() {
  const [isChecking, setIsChecking] = useState(true);
  const [view, setView] = useState<"landing" | "register" | "ticket" | "maintenance">("landing");
  const [config, setConfig] = useState<any>({});
  const [campuses, setCampuses] = useState<any[]>([]);
  const [rundown, setRundown] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [realCounts, setRealCounts] = useState({ participants: 0, campuses: 0 });
  const [videoOpen, setVideoOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", origin_school: "", phone: "" });
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });
  
  // ERROR STATE DIAGNOSTIK
  const [debugError, setDebugError] = useState<string | null>(null);

  const showNotify = (message: string, type: "info" | "error" = "info") => { setNotification({ show: true, message, type }); };
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);
  const yVideo = useTransform(scrollY, [500, 1000], [50, -50]);

  useEffect(() => {
    const initSystem = async () => {
        try {
            // --- DIAGNOSTIK KONEKSI ---
            const { data: testData, error: testError } = await supabase.from("event_settings").select("*");
            
            if (testError) {
                setDebugError(`KONEKSI GAGAL: ${testError.message}. (Cek Vercel Env Vars!)`);
                setIsChecking(false);
                return;
            }
            if (!testData || testData.length === 0) {
                setDebugError("KONEKSI BERHASIL TAPI DATA KOSONG. Cek SQL Insert.");
            }
            // --------------------------

            const [settingsRes, campusesRes, rundownRes, faqRes] = await Promise.all([
                supabase.from("event_settings").select("*"),
                supabase.from("event_campuses").select("*").order('id'),
                supabase.from("event_rundown").select("*").order('id'),
                supabase.from("event_faq").select("*").order('id')
            ]);
            
            const { count: pCount } = await supabase.from("participants").select("*", { count: 'exact', head: true });

            if (settingsRes.data) { 
                const conf: any = {}; 
                settingsRes.data.forEach((i) => conf[i.key] = i.value); 
                setConfig(conf);
                if (conf.site_mode === 'MAINTENANCE' || conf.site_mode === 'COMING_SOON') { setView("maintenance"); setIsChecking(false); return; }
            }
            
            if (campusesRes.data) setCampuses(campusesRes.data);
            if (rundownRes.data) setRundown(rundownRes.data);
            if (faqRes.data) setFaqs(faqRes.data);
            setRealCounts({ participants: pCount || 0, campuses: campusesRes.data?.length || 0 });
            
            const savedTicketID = localStorage.getItem("smkn1_expo_ticket_id");
            if (savedTicketID) {
                const { data } = await supabase.from("participants").select("*").eq("id", savedTicketID).single();
                if (data) { setTicketData(data); setView("ticket"); } else { localStorage.removeItem("smkn1_expo_ticket_id"); setView("landing"); }
            }
        } catch (error: any) { 
            console.error("Init Error:", error); 
            setDebugError("CRITICAL ERROR: " + error.message);
        } finally { setIsChecking(false); }
    };
    initSystem();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { data: existing } = await supabase.from("participants").select("id").or(`email.eq.${formData.email},phone.eq.${formData.phone}`).maybeSingle();
    if (existing) { showNotify("Email atau Nomor HP ini sudah terdaftar!", "error"); setLoading(false); return; }
    const { data, error } = await supabase.from("participants").insert([formData]).select().single();
    if (error) { showNotify("Gagal: " + error.message, "error"); setLoading(false); } 
    else { localStorage.setItem("smkn1_expo_ticket_id", data.id); setTicketData(data); setTimeout(() => { setLoading(false); setView("ticket"); }, 1500); }
  };

  const resetDevice = () => { if(confirm("Reset device ini?")) { localStorage.removeItem("smkn1_expo_ticket_id"); window.location.reload(); } }

  if (isChecking) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-12 h-12 text-cyan-600 animate-spin"/></div>;

  return (
    <main className="min-h-screen font-sans text-slate-800 relative selection:bg-cyan-200 selection:text-cyan-900">
      <TechBackground />
      
      {/* --- ERROR BOX DIAGNOSTIK (HANYA MUNCUL JIKA ERROR) --- */}
      {debugError && (
          <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 z-[9999] text-center font-bold shadow-xl animate-bounce">
              <div className="flex items-center justify-center gap-2">
                  <AlertTriangle size={24}/> 
                  <span>{debugError}</span>
              </div>
              <p className="text-xs font-normal opacity-90 mt-1">Cek Vercel Settings {'>'} Environment Variables.</p>
          </div>
      )}
      {/* --------------------------------------------------- */}

      {view !== "ticket" && config.announcement && <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className="bg-slate-900 text-white text-xs font-bold py-3 text-center sticky top-0 z-[60] shadow-xl">INFO: {config.announcement}</motion.div>}
      
      {view !== "ticket" && (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 h-24 transition-all">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <div className="flex items-center gap-4 font-black text-2xl tracking-tighter cursor-pointer group select-none" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    {config.event_logo_url ? (<img src={config.event_logo_url} alt="Event Logo" className="h-12 w-auto object-contain hover:scale-105 transition-transform" />) : (<div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:rotate-12 transition-transform duration-300"><Cpu className="w-6 h-6"/></div><span className="text-slate-900 text-2xl">EXPO<span className="text-cyan-600">SMKN1</span></span></div>)}
                </div>
                {view === "landing" && <button onClick={() => config.status === "CLOSED" ? showNotify("Mohon maaf, pendaftaran saat ini sedang ditutup!", "error") : setView("register")} className={`hidden md:flex px-8 py-4 rounded-full font-bold transition-all shadow-xl hover:-translate-y-1 items-center gap-3 text-sm ${config.status === "CLOSED" ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-cyan-600"}`}>{config.status === "CLOSED" ? "Pendaftaran Ditutup" : "Daftar Sekarang"}</button>}
            </div>
        </nav>
      )}

      <AnimatePresence mode="wait">
        {view === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <section className="relative pt-12 pb-32 px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center overflow-visible">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                  <motion.div style={{ y: yHero, opacity: opacityHero }} className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 border border-white rounded-full text-cyan-700 text-xs font-bold mb-8 backdrop-blur-sm shadow-sm ring-1 ring-cyan-100">Official Event SMKN 1 Kademangan</div>
                      {/* FALLBACK TITLE JIKA LOADING */}
                      <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">{config.hero_title || "LOADING..."}</h1>
                      <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed border-l-4 border-cyan-500 pl-6">{config.hero_subtitle || "Mohon tunggu sebentar..."}</p>
                      <div className="flex flex-wrap gap-4">
                          <button onClick={() => config.status === "CLOSED" ? showNotify("Pendaftaran Ditutup!", "error") : setView("register")} className={`px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all hover:scale-105 flex items-center gap-3 ${config.status === "CLOSED" ? "bg-slate-200 text-slate-400" : "bg-slate-900 text-white"}`}>{config.status === "CLOSED" ? "Pendaftaran Ditutup" : "Ambil Tiket"}</button>
                          <div className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold shadow-sm"><Calendar className="w-5 h-5 text-cyan-500"/> {config.event_date?.split(" ")[0]} {config.event_date?.split(" ")[1]}</div>
                      </div>
                      <div className="mt-20 flex flex-wrap gap-12 border-t border-slate-200 pt-10">
                          <div><div className="text-5xl font-black text-slate-900 flex items-baseline"><Counter to={realCounts.campuses}/><span className="text-cyan-600 text-3xl ml-1">+</span></div><div className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">Kampus</div></div>
                          <div><div className="text-5xl font-black text-slate-900 flex items-baseline"><Counter to={realCounts.participants}/><span className="text-cyan-600 text-3xl ml-1">+</span></div><div className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">Peserta</div></div>
                          <div><div className="text-5xl font-black text-slate-900 flex items-baseline"><Counter to={parseInt(config.stats_speakers || 0)}/></div><div className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">Speakers</div></div>
                      </div>
                  </motion.div>
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }} className="relative h-[650px] hidden md:block perspective-1000">
                      <motion.div animate={{ y: [0, -30, 0], rotateX: [0, 5, 0], rotateY: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-[3rem] shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white/20">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                          <div className="relative z-10 text-center text-white p-10"><Cpu className="w-32 h-32 text-white drop-shadow-lg mx-auto mb-6" /><h3 className="text-5xl font-black mb-3 tracking-tight">Society 5.0</h3><p className="text-cyan-100 text-xl font-medium tracking-wide">Integrated Education Ecosystem</p></div>
                      </motion.div>
                  </motion.div>
              </div>
            </section>

            <CampusMarquee items={campuses} />

            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="py-32 px-6 max-w-7xl mx-auto">
                <motion.div style={{ y: yVideo }} className="relative">
                    <div onClick={() => setVideoOpen(true)} className="bg-slate-900 rounded-[3.5rem] overflow-hidden relative min-h-[600px] flex items-center justify-center group cursor-pointer shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 via-slate-900 to-purple-900 opacity-90 transition-opacity group-hover:opacity-95"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-[1.5s]"></div>
                        <div className="relative z-10 text-center p-10">
                            <motion.div whileHover={{ scale: 1.2, rotate: 90 }} className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 mb-8 mx-auto hover:bg-cyan-500/80 transition-all"><PlayCircle className="w-14 h-14 text-white ml-2 fill-white/20" /></motion.div>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">AFTERMOVIE 2024</h2>
                            <p className="text-slate-300 text-2xl font-light">Saksikan keseruan tahun lalu.</p>
                        </div>
                    </div>
                </motion.div>
            </motion.section>

            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10"><Quote className="w-20 h-20 text-cyan-100 mx-auto mb-10" /><h3 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-12 italic">"{config.headmaster_quote}"</h3><div className="inline-flex items-center gap-6 bg-slate-50 px-8 py-4 rounded-full border border-slate-100 shadow-sm"><div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg text-white"><Mic className="w-8 h-8"/></div><div className="text-left"><div className="font-bold text-slate-900 text-xl">{config.headmaster_name}</div><div className="text-cyan-600 font-bold text-sm tracking-wider uppercase">Kepala SMKN 1 Kademangan</div></div></div></div>
            </section>

            <section className="py-32 px-6 max-w-7xl mx-auto"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]"><motion.div variants={fadeUpVariant} className="md:col-span-2 md:row-span-2 rounded-[2.5rem] bg-white border border-slate-200 p-10 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all group overflow-hidden relative"><div className="relative z-10"><span className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">Highlight Utama</span><h3 className="text-4xl font-black mb-4 mt-4 text-slate-900">Talkshow Industri</h3><p className="text-slate-500 text-lg leading-relaxed">Diskusi panel eksklusif bersama HRD perusahaan multinasional.</p></div><div className="relative z-10 mt-12 flex -space-x-4">{[1,2,3].map(i=><div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 shadow-md">User</div>)}<div className="w-14 h-14 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-md">+50</div></div></motion.div><motion.div variants={fadeUpVariant} className="md:col-span-2 rounded-[2.5rem] bg-slate-900 text-white p-10 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden group"><div className="relative z-10 max-w-xs"><h3 className="text-3xl font-bold mb-3">Grand Doorprize</h3><p className="text-slate-300">Laptop Gaming, Tablet Grafis & Beasiswa.</p></div><Award className="w-32 h-32 text-yellow-400 relative z-10 group-hover:rotate-12 transition-transform" /></motion.div><motion.div variants={fadeUpVariant} className="rounded-[2.5rem] bg-blue-50 border border-blue-100 p-8 hover:bg-blue-100 transition-colors flex flex-col justify-center"><div className="w-12 h-12 bg-blue-200 text-blue-700 rounded-2xl flex items-center justify-center mb-4"><Sparkles size={24}/></div><h3 className="text-xl font-bold text-blue-900 mb-2">Konsultasi Gratis</h3><p className="text-blue-700/80 text-sm">Psikotes minat bakat di tempat.</p></motion.div><motion.div variants={fadeUpVariant} className="rounded-[2.5rem] bg-white border border-slate-200 p-8 flex flex-col items-center justify-center text-center hover:border-cyan-500 transition-colors group"><Calendar className="w-10 h-10 text-cyan-500 mb-4" /><div className="text-4xl font-black text-slate-900">{config.event_date?.split(" ")[0] || "20"}</div><div className="text-slate-400 font-bold text-sm uppercase tracking-widest">{config.event_date?.split(" ")[1] || "MEI 2025"}</div></motion.div></motion.div></section>

            <section className="py-32 px-6 bg-white border-y border-slate-100 relative"><div className="max-w-4xl mx-auto"><div className="text-center mb-20"><h2 className="text-4xl font-black text-slate-900 mt-2">RUNDOWN ACARA</h2></div><div className="relative border-l-4 border-slate-100 ml-6 md:ml-0 space-y-16">{rundown.map((item, i) => (<motion.div initial={{opacity:0, x:-50}} whileInView={{opacity:1, x:0}} viewport={{ once: true }} transition={{delay: i*0.1}} key={i} className="relative pl-12 md:pl-24 group"><div className="absolute left-[-11px] top-0 w-6 h-6 bg-white border-4 border-cyan-500 rounded-full z-10 shadow-lg"></div><div className="absolute left-16 md:left-[-120px] top-[-5px] md:w-24 font-black text-2xl md:text-xl text-slate-300 text-right">{item.time}</div><div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 group-hover:border-cyan-200 transition-all"><h3 className="text-2xl font-bold text-slate-900">{item.title}</h3><p className="text-slate-500 mt-2 text-lg">{item.description}</p></div></motion.div>))}</div></div></section>

            <section className="py-32 px-6 max-w-3xl mx-auto"><h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Pertanyaan Umum</h2><div className="space-y-6">{faqs.map((f, i) => (<motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} key={i} className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300"><button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full py-6 px-8 flex justify-between items-center text-left bg-white hover:bg-slate-50 transition-colors"><span className="font-bold text-slate-800 text-lg flex items-center gap-4"><span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-sm font-black">Q</span> {f.question}</span><ChevronDown size={18} className={`transition-transform duration-300 ${openFaq===i ? "rotate-180" : ""}`} /></button><AnimatePresence>{openFaq === i && (<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="bg-slate-50 border-t border-slate-100"><div className="p-8 text-slate-600 leading-relaxed text-lg">{f.answer}</div></motion.div>)}</AnimatePresence></motion.div>))}</div></section>

            <section className="py-32 px-6 bg-slate-900 text-center relative overflow-hidden"><motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} className="relative z-10 max-w-4xl mx-auto"><h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">Siap Bergabung?</h2><button onClick={() => config.status === "CLOSED" ? showNotify("Mohon maaf, pendaftaran saat ini sedang ditutup!", "error") : setView("register")} className={`px-16 py-6 rounded-full font-bold text-xl shadow-2xl transition-all transform hover:scale-105 ${config.status === "CLOSED" ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"}`}>{config.status === "CLOSED" ? "Pendaftaran Ditutup" : "Daftarkan Diriku Sekarang"}</button><p className="mt-8 text-slate-600 text-sm font-mono">© 2025 SMKN 1 Kademangan Expo Team.</p></motion.div></section>
          </motion.div>
        )}

        {view === "register" && (
          <motion.div key="register" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6"><div className="w-full max-w-lg bg-white p-8 md:p-10 md:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl h-[95vh] md:h-auto overflow-y-auto relative border border-white/20"><div className="flex justify-between items-center mb-8"><div><h2 className="text-3xl font-black text-slate-900">Registrasi</h2><p className="text-slate-500 text-sm">Isi data diri dengan benar.</p></div><button onClick={() => setView("landing")} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors text-xl">✕</button></div><div className="bg-blue-50 p-6 rounded-2xl mb-8 flex gap-4 items-start border border-blue-100 shadow-inner"><div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Lock size={20}/></div><p className="text-sm text-blue-800 font-medium leading-relaxed"><strong className="block mb-1 text-blue-900">Device Lock System</strong>Tiket akan terkunci otomatis di perangkat ini.</p></div><form onSubmit={handleRegister} className="space-y-6">{["Name", "School Origin", "Email", "Phone"].map((l, i) => (<div key={i}><label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">{l}</label><input required type={l==="Email"?"email":"text"} placeholder={`Masukkan ${l}`} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-cyan-500 focus:bg-white transition-all" onChange={e => setFormData({...formData, [l==="Name"?"name":l==="School Origin"?"origin_school":l==="Email"?"email":"phone"]: e.target.value})} /></div>))}<button disabled={loading} className="w-full mt-8 bg-slate-900 text-white font-bold py-5 rounded-2xl flex justify-center items-center gap-3 hover:bg-cyan-600 transition-all shadow-xl disabled:opacity-70">{loading ? <Loader2 className="animate-spin" /> : <>Konfirmasi & Dapatkan Tiket <ArrowRight size={20}/></>}</button></form></div></motion.div>
        )}

        {/* ... TICKET & NOTIFIKASI CODE (NO CHANGE) ... */}
        {view === "ticket" && ticketData && (
          <motion.div key="ticket" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-[200] bg-slate-100 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"><div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 relative transform transition-transform hover:scale-[1.01] duration-500"><div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 p-10 text-center text-white relative overflow-hidden"><div className="relative z-10"><div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-4 border border-white/30 shadow-lg"><Star className="w-3 h-3 text-yellow-300 fill-yellow-300"/> VIP Access Pass</div><h2 className="text-3xl font-black tracking-wide drop-shadow-md">E-TICKET</h2></div></div><div className="p-10 flex flex-col items-center gap-8 relative bg-white"><div className="p-4 border-2 border-dashed border-slate-300 rounded-3xl relative group cursor-pointer bg-slate-50 shadow-inner"><QRCodeSVG value={ticketData.ticket_code || `EXPO-${ticketData.id}`} size={180} /></div><div className="text-center w-full"><h3 className="text-2xl font-black text-slate-900 uppercase truncate mb-1">{ticketData.name}</h3><p className="text-cyan-600 font-bold text-sm bg-cyan-50 inline-block px-3 py-1 rounded-lg border border-cyan-100">{ticketData.origin_school}</p></div></div><div className="bg-slate-50 p-5 text-center border-t border-slate-200"><p className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> DEVICE VERIFIED & SECURE</p></div></div><button onClick={resetDevice} className="mt-8 px-8 py-3 rounded-full border border-slate-300 text-slate-400 text-xs font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all uppercase tracking-wider">Reset Device ID (Dev Mode)</button></motion.div>
        )}

        {notification.show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setNotification({ ...notification, show: false })}>
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden border border-white/20" onClick={(e) => e.stopPropagation()}>
               <div className={`absolute top-0 left-0 w-full h-2 ${notification.type === 'error' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${notification.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-cyan-50 text-cyan-600'}`}>{notification.type === 'error' ? <Lock size={40} /> : <Info size={40} />}</div>
               <h3 className="text-2xl font-black text-slate-900 mb-2">{notification.type === 'error' ? 'Akses Ditolak' : 'Informasi'}</h3>
               <p className="text-slate-500 leading-relaxed mb-8">{notification.message}</p>
               <button onClick={() => setNotification({ ...notification, show: false })} className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] shadow-lg ${notification.type === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-900 hover:bg-slate-800'}`}>Mengerti, Tutup</button>
            </motion.div>
          </motion.div>
        )}

        {videoOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setVideoOpen(false)}>
             <button onClick={() => setVideoOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"><X size={32}/></button>
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 ring-1 ring-white/20" onClick={(e) => e.stopPropagation()}><iframe className="w-full h-full" src={`https://www.youtube.com/embed/${getYoutubeId(config.youtube_video_id)}?autoplay=1`} title="Aftermovie" allow="autoplay; encrypted-media" allowFullScreen/></motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}