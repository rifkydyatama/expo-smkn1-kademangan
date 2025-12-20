"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  Users, 
  MonitorPlay, 
  School, 
  Calendar, 
  HelpCircle, 
  LogOut, 
  Search, 
  Download, 
  Save, 
  Trash2, 
  Plus, 
  CheckCircle, 
  XCircle, 
  UploadCloud, 
  RefreshCw, 
  Settings, 
  BarChart3, 
  ChevronRight, 
  ScanLine, 
  AlertCircle,
  UserCheck,
  Youtube,
  Lock,
  Unlock,
  Construction, // Icon Maintenance
  Timer,        // Icon Coming Soon
  Globe,        // Icon Live
  Bell,         // Icon Notifikasi
  ShieldCheck,  // Icon Secure
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. DEFINISI TIPE DATA (LENGKAP) ---
type Participant = { 
  id: number; 
  name: string; 
  origin_school: string; 
  email: string; 
  phone: string; 
  created_at: string;
  status: string;          // Status kehadiran (REGISTERED / CHECKED-IN)
  check_in_time: string;   // Waktu scan barcode
  ticket_code?: string;    // Kode UUID Unik
};

type Campus = { 
  id: number; 
  name: string; 
  logo_url: string; 
  description: string; 
};

type Rundown = { 
  id: number; 
  time: string; 
  title: string; 
  description: string; 
};

type Faq = { 
  id: number; 
  question: string; 
  answer: string; 
};

export default function AdminPage() {
  // --- 2. STATE MANAGEMENT ---
  const [session, setSession] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Data State (Database)
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [rundown, setRundown] = useState<Rundown[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [settings, setSettings] = useState<any>({});
  
  // UI Helper State
  const [search, setSearch] = useState("");
  
  // --- NOTIFIKASI STATE (CUSTOM POPUP) ---
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });

  const showNotify = (message: string, type: "info" | "error" | "success" = "info") => {
      setNotification({ show: true, message, type });
      // Auto hide setelah 3 detik
      setTimeout(() => {
          setNotification({ show: false, message: "", type: "info" });
      }, 3000);
  };

  // --- 3. STATE KHUSUS FITUR ---
  
  // A. State untuk Gate Scanner
  const [scanId, setScanId] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanStatus, setScanStatus] = useState<"IDLE" | "SUCCESS" | "ERROR" | "USED">("IDLE");

  // B. State untuk Data Master (Input Baru)
  const [newRundown, setNewRundown] = useState({ time: "", title: "", description: "" });
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  // C. State untuk Upload Kampus
  const [newCampusName, setNewCampusName] = useState("");
  const [newCampusDesc, setNewCampusDesc] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mainLogoFile, setMainLogoFile] = useState<File | null>(null);

  // --- 4. LOGIN SYSTEM ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials (bisa diganti nanti)
    if (email === "admin" && password === "admin123") {
      setSession(true);
      fetchAllData();
      showNotify("Berhasil Login! Selamat datang Admin.", "success");
    } else { 
      showNotify("Akses Ditolak! Username atau Password salah.", "error");
    }
  };

  // --- 5. DATA FETCHING (REAL-TIME REFRESH) ---
  const fetchAllData = async () => {
    setRefreshing(true);
    try {
        // 1. Settings
        const { data: s } = await supabase.from("event_settings").select("*");
        const conf: any = {}; 
        s?.forEach(item => conf[item.key] = item.value); 
        
        if (!conf.site_mode) conf.site_mode = "LIVE";
        if (!conf.status) conf.status = "OPEN";

        setSettings(conf);

        // 2. Participants
        const { data: p } = await supabase.from("participants").select("*").order('id', { ascending: false });
        if(p) setParticipants(p);

        // 3. Campuses
        const { data: c } = await supabase.from("event_campuses").select("*").order('id'); 
        if(c) setCampuses(c);
        
        // 4. Rundown
        const { data: r } = await supabase.from("event_rundown").select("*").order('id'); 
        if(r) setRundown(r);

        // 5. FAQ
        const { data: f } = await supabase.from("event_faq").select("*").order('id'); 
        if(f) setFaqs(f);

    } catch (error) {
        console.error("Gagal mengambil data:", error);
        showNotify("Gagal koneksi ke database.", "error");
    } finally {
        setRefreshing(false);
    }
  };

  // --- 6. FITUR: GATE CHECK-IN (SCANNER LOGIC FIX) ---
  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setScanResult(null);
    
    // 1. Bersihkan Input (Support QR Lama "EXPO-123" & QR Baru UUID)
    let cleanId = scanId.trim();
    
    // Hapus prefix "EXPO-" kalau ada (Case Insensitive)
    if (cleanId.toUpperCase().startsWith("EXPO-")) {
        cleanId = cleanId.replace(/EXPO-/i, "");
    }

    if (!cleanId) {
        setLoading(false);
        return;
    }

    // 2. LOGIC PINTAR: Cari berdasarkan ID (Angka) ATAU UUID (Kode Unik)
    let user = null;
    
    // A. Cek apakah ini ID Angka (Peserta Lama / QR Lama)
    if (!isNaN(Number(cleanId))) {
         const { data } = await supabase.from("participants").select("*").eq("id", cleanId).single();
         user = data;
    } 
    
    // B. Jika belum ketemu, cari sebagai UUID (Kode Unik Baru)
    if (!user) {
         const { data } = await supabase.from("participants").select("*").eq("ticket_code", cleanId).single();
         user = data;
    }

    // 3. EKSEKUSI HASIL
    if (!user) {
        setScanStatus("ERROR"); // Data Gak Ada
        showNotify("TIKET TIDAK VALID! Data tidak ditemukan.", "error");
    } else if (user.status === "CHECKED-IN") {
        setScanResult(user);
        setScanStatus("USED");  // Tiket Bekas
        showNotify(`Tiket a.n ${user.name} SUDAH DIGUNAKAN!`, "error");
    } else {
        // Update Status jadi Hadir
        await supabase
            .from("participants")
            .update({ 
                status: "CHECKED-IN", 
                check_in_time: new Date().toISOString() 
            })
            .eq("id", user.id);
        
        setScanResult(user);
        setScanStatus("SUCCESS"); // Berhasil
        showNotify(`Check-in Berhasil: ${user.name}`, "success");
        fetchAllData(); 
    }
    
    setScanId(""); // Kosongkan input biar siap scan lagi
    setLoading(false);
  };

  // --- 7. FITUR: UPLOAD GAMBAR LOGO ---
  const handleUploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload ke Bucket 'campus-logos'
      const { error: uploadError } = await supabase.storage
        .from("campus-logos")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Ambil Public URL
      const { data } = supabase.storage
        .from("campus-logos")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      showNotify("Gagal Upload Gambar: " + error.message, "error");
      return null;
    }
  };

  const handleUpdateMainLogo = async () => {
    if (!mainLogoFile) return showNotify("Pilih gambar logo dulu!", "error");
    setLoading(true);

    // Kita pakai fungsi upload yang sama dengan kampus
    const url = await handleUploadImage(mainLogoFile);

    if (url) {
      // Simpan URL ke tabel settings dengan key 'event_logo_url'
      await supabase
        .from("event_settings")
        .upsert(
          { key: "event_logo_url", value: url },
          { onConflict: "key" }
        );

      setMainLogoFile(null);
      showNotify("Logo Website Berhasil Diupdate!", "success");
      fetchAllData();
    }

    setLoading(false);
  };
    // --- 8. CRUD ACTIONS ---
  
  // Simpan Konfigurasi
  const saveSettings = async () => {
    setLoading(true);
    for (const [key, value] of Object.entries(settings)) {
       await supabase.from("event_settings").upsert({ key, value: String(value) }, { onConflict: 'key' });
    }
    setLoading(false); 
    showNotify("✅ Semua konfigurasi berhasil disimpan!", "success"); 
    fetchAllData();
  };

  // Tambah Kampus Baru (dengan Upload)
  const addCampus = async () => {
    if (!newCampusName) return showNotify("⚠️ Nama Kampus Wajib Diisi!", "error");
    setUploading(true);
    
    let finalUrl = "";
    if (logoFile) {
        const url = await handleUploadImage(logoFile);
        if (url) finalUrl = url;
    }

    const { error } = await supabase.from("event_campuses").insert({
        name: newCampusName,
        description: newCampusDesc,
        logo_url: finalUrl
    });

    if (error) showNotify("Gagal simpan kampus: " + error.message, "error");
    else {
        setNewCampusName(""); 
        setNewCampusDesc(""); 
        setLogoFile(null); 
        showNotify("Data Kampus berhasil ditambahkan!", "success");
        fetchAllData();
    }
    setUploading(false);
  };

  // Tambah Item Umum
  const addItem = async (table: string, data: any) => {
    await supabase.from(table).insert(data);
    setNewRundown({time:"", title:"", description:""}); 
    setNewFaq({question:"", answer:""});
    showNotify("Data berhasil ditambahkan!", "success");
    fetchAllData();
  };

  // Hapus Item
  const deleteItem = async (table: string, id: number) => {
    if(confirm("⚠️ Hapus data ini permanen?")) {
        await supabase.from(table).delete().eq("id", id);
        showNotify("Data berhasil dihapus.", "success");
        fetchAllData();
    }
  };

  // Export CSV
  const downloadCSV = () => {
    const headers = ["ID,UUID,Nama,Sekolah,Email,No HP,Status,Waktu Check-in"];
    const rows = participants.map(p => 
        `${p.id},"${p.ticket_code || '-'}","${p.name}","${p.origin_school}","${p.email}","${p.phone}","${p.status}","${p.check_in_time || "-"}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent); 
    link.download = `Laporan_Peserta_${new Date().toISOString().split('T')[0]}.csv`; 
    link.click();
    showNotify("Laporan CSV berhasil diunduh!", "success");
  };

  // --- 9. RENDER UI: LOGIN PAGE ---
  if (!session) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className={`fixed top-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 font-bold text-sm ${
                    notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
            >
                {notification.type === 'error' ? <AlertCircle size={18}/> : <CheckCircle size={18}/>}
                {notification.message}
            </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-cyan-500 to-blue-600"></div>
        <div className="text-center mb-10">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-cyan-500/20 rotate-3">
                <Settings size={40}/>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">ADMIN 5.0 PRO</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">SMKN 1 Kademangan Expo Control</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Username</label>
                <input 
                  autoFocus 
                  type="text" 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-cyan-500 focus:bg-white transition-all text-slate-800"
                />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Password</label>
                <input 
                  type="password" 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-cyan-500 focus:bg-white transition-all text-slate-800"
                />
            </div>
            <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 mt-4">
                MASUK DASHBOARD
            </button>
        </form>
        <p className="text-center text-xs text-slate-300 mt-8">System v6.0 (Secure & Notif)</p>
      </div>
    </div>
  );


  // --- 10. RENDER UI: DASHBOARD (MAIN) ---
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* GLOBAL NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification.show && (
            <motion.div 
                initial={{ opacity: 0, y: 50, x: 50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 50, x: 50 }}
                className={`fixed bottom-10 right-10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-100 border-l-8 ${
                    notification.type === 'error' ? 'bg-white border-red-500 text-red-600' : 
                    notification.type === 'success' ? 'bg-white border-green-500 text-green-600' :
                    'bg-slate-900 border-cyan-500 text-white'
                }`}
            >
                <div className={`p-2 rounded-full ${
                    notification.type === 'error' ? 'bg-red-100' : 
                    notification.type === 'success' ? 'bg-green-100' :
                    'bg-slate-800'
                }`}>
                    {notification.type === 'error' ? <AlertCircle size={20}/> : 
                     notification.type === 'success' ? <CheckCircle size={20}/> : 
                     <Bell size={20}/>}
                </div>
                <div>
                    <h4 className="font-bold text-sm uppercase">{notification.type === 'error' ? 'Gagal' : notification.type === 'success' ? 'Berhasil' : 'Info'}</h4>
                    <p className="text-xs font-medium opacity-90">{notification.message}</p>
                </div>
                <button onClick={() => setNotification({ ...notification, show: false })}><XCircle size={18} className="opacity-50 hover:opacity-100"/></button>
            </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-white border-r border-slate-200 flex-col hidden md:flex fixed h-full z-20 shadow-sm">
        <div className="p-8 border-b border-slate-100">
            <div className="font-black text-2xl tracking-tighter text-slate-900">
                EXPO<span className="text-cyan-600">ADMIN</span>
            </div>
            <div className="text-[10px] font-bold text-slate-400 mt-1 tracking-widest flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                CONTROL CENTER V6.0
            </div>
        </div>
        
        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
                {id: "dashboard", label: "Overview", icon: LayoutDashboard},
                {id: "scanner", label: "Gate Scanner", icon: ScanLine},
                {id: "participants", label: "Data Peserta", icon: Users},
                {id: "cms", label: "Edit Landing Page", icon: MonitorPlay},
                {id: "data_master", label: "Data Master", icon: Settings},
            ].map(m => (
                <button 
                    key={m.id} 
                    onClick={() => setActiveTab(m.id)} 
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                        activeTab === m.id 
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 translate-x-1" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                    <m.icon size={18} /> {m.label}
                </button>
            ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
            <button 
                onClick={() => setSession(false)} 
                className="w-full flex items-center gap-2 px-5 py-4 text-red-500 font-bold hover:bg-red-50 rounded-xl text-sm transition-colors"
            >
                <LogOut size={18}/> Keluar Sistem
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="ml-0 md:ml-72 flex-1 p-8 md:p-10 transition-all">
        
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{activeTab.replace(/_/g, " ")}</h2>
                <p className="text-slate-500 text-sm font-medium mt-1 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                        settings.site_mode === 'LIVE' ? 'bg-green-500' :
                        settings.site_mode === 'MAINTENANCE' ? 'bg-yellow-500' :
                        'bg-blue-500'
                    }`}></span>
                    Mode Situs: <strong>{settings.site_mode}</strong> • Sync: {new Date().toLocaleTimeString()}
                </p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={fetchAllData} 
                    className={`p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-cyan-600 shadow-sm hover:shadow-md transition-all ${refreshing ? "animate-spin" : ""}`}
                    title="Refresh Data"
                >
                    <RefreshCw size={20}/>
                </button>
            </div>
        </div>

        {/* ================================================================================== */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ================================================================================== */}
        {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
                {/* Card 1: Total Peserta */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><Users size={24}/></div>
                    </div>
                    <div className="text-5xl font-black text-slate-900 tracking-tight">{participants.length}</div>
                    <div className="text-sm text-slate-500 font-bold mt-2">Total Pendaftar</div>
                </div>

                {/* Card 2: Peserta Hadir (Check-in) */}
                <div className="bg-green-50 p-6 rounded-3xl border border-green-200 shadow-sm hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-4 bg-white text-green-600 rounded-2xl group-hover:scale-110 transition-transform"><UserCheck size={24}/></div>
                    </div>
                    <div className="text-5xl font-black text-green-700 tracking-tight">
                        {participants.filter(p => p.status === "CHECKED-IN").length}
                    </div>
                    <div className="text-sm text-green-700 font-bold mt-2">Peserta Hadir (Scan)</div>
                </div>

                {/* Card 3: Kampus */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform"><School size={24}/></div>
                    </div>
                    <div className="text-5xl font-black text-slate-900 tracking-tight">{campuses.length}</div>
                    <div className="text-sm text-slate-500 font-bold mt-2">Partner Kampus</div>
                </div>

                {/* Card 4: SITE MODE */}
                <div className={`p-6 rounded-3xl border shadow-sm text-white flex flex-col justify-between ${
                    settings.site_mode === "LIVE" ? "bg-linear-to-br from-green-500 to-emerald-700 border-green-600" : 
                    settings.site_mode === "MAINTENANCE" ? "bg-linear-to-br from-yellow-500 to-amber-600 border-yellow-600" :
                    "bg-linear-to-br from-blue-500 to-indigo-600 border-blue-600"
                }`}>
                    <div className="font-bold opacity-80 flex items-center gap-2"><Settings size={16}/> SITE MODE</div>
                    <div className="text-3xl font-black tracking-widest mt-4">{settings.site_mode}</div>
                    <div className="text-xs opacity-75 mt-2 font-medium">Status Website Saat Ini</div>
                </div>
                
                {/* Recent Activity Table */}
                <div className="md:col-span-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mt-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-xl text-slate-900">Aktivitas Pendaftaran Terkini</h3>
                            <p className="text-sm text-slate-400">5 pendaftar terakhir yang masuk ke database.</p>
                        </div>
                        <button onClick={() => setActiveTab('participants')} className="px-4 py-2 bg-slate-50 rounded-lg text-sm font-bold text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700 flex items-center gap-2 transition-colors">
                            Lihat Semua <ChevronRight size={16}/>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 rounded-l-xl">Nama Lengkap</th>
                                    <th className="p-4">Asal Sekolah</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 rounded-r-xl">Waktu Daftar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {participants.slice(0,5).map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4 font-bold text-slate-900">{p.name}</td>
                                        <td className="p-4 text-slate-500">{p.origin_school}</td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${p.status === "CHECKED-IN" ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs font-mono text-slate-400">{new Date(p.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* ================================================================================== */}
        {/* TAB 2: GATE CHECK-IN (SCANNER) */}
        {/* ================================================================================== */}
        {activeTab === "scanner" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300 slide-in-from-bottom-4">
                
                {/* Kolom Kiri: Input Area */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border shadow-lg border-slate-200">
                        <h3 className="font-black text-xl mb-4 flex items-center gap-2 text-slate-800">
                            <ShieldCheck className="text-cyan-600" size={24}/> SECURE SCANNER
                        </h3>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            Scan QR Code tiket. Mendukung verifikasi UUID (Anti-Palsu) dan ID Biasa.
                        </p>
                        
                        <form onSubmit={handleCheckIn} className="relative">
                            <div className="relative">
                                <input 
                                    autoFocus 
                                    value={scanId} 
                                    onChange={e => setScanId(e.target.value)} 
                                    placeholder="Scan QR / Ketik ID..." 
                                    className="w-full p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl text-3xl font-black text-center tracking-widest outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all uppercase placeholder:text-slate-300"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    {loading && <RefreshCw className="animate-spin"/>}
                                </div>
                            </div>
                            <button 
                                disabled={loading}
                                className="w-full mt-4 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-cyan-600 transition-colors shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {loading ? "MEMERIKSA..." : "VERIFIKASI TIKET"}
                            </button>
                        </form>
                    </div>

                    {/* STATUS CARD: SUKSES */}
                    {scanStatus === "SUCCESS" && scanResult && (
                        <div className="bg-green-100 border-2 border-green-200 p-8 rounded-3xl text-center animate-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-green-500/30">
                                <CheckCircle size={48}/>
                            </div>
                            <h2 className="text-4xl font-black text-green-700 tracking-tight">TIKET VALID!</h2>
                            <p className="text-green-600 font-bold mt-2 text-lg">Silakan Masuk</p>
                            
                            <div className="mt-8 bg-white p-6 rounded-2xl border border-green-200 shadow-sm text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full"></div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Peserta</div>
                                <div className="text-2xl font-black text-slate-900 mb-4">{scanResult.name}</div>
                                
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Asal Sekolah</div>
                                <div className="text-lg font-bold text-slate-700">{scanResult.origin_school}</div>
                            </div>
                        </div>
                    )}

                    {/* STATUS CARD: SUDAH DIPAKAI */}
                    {scanStatus === "USED" && scanResult && (
                        <div className="bg-orange-50 border-2 border-orange-200 p-8 rounded-3xl text-center animate-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-orange-500/30">
                                <AlertCircle size={48}/>
                            </div>
                            <h2 className="text-3xl font-black text-orange-700 tracking-tight">SUDAH DIPAKAI!</h2>
                            <p className="text-orange-600 font-bold mt-2">Peserta ini sudah masuk sebelumnya.</p>
                            
                            <div className="mt-8 bg-white p-6 rounded-2xl border border-orange-200 shadow-sm text-left">
                                <div className="text-xl font-bold text-slate-900">{scanResult.name}</div>
                                <div className="p-4 bg-orange-100 rounded-xl border border-orange-200 text-orange-800 text-sm font-bold flex items-center gap-3 mt-4">
                                    <Calendar size={18}/>
                                    Check-in: {new Date(scanResult.check_in_time).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STATUS CARD: ERROR */}
                    {scanStatus === "ERROR" && (
                        <div className="bg-red-50 border-2 border-red-200 p-8 rounded-3xl text-center animate-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-red-500/30">
                                <XCircle size={48}/>
                            </div>
                            <h2 className="text-3xl font-black text-red-700 tracking-tight">TIKET PALSU!</h2>
                            <p className="text-red-600 font-bold mt-2">ID/UUID tidak ditemukan di database.</p>
                        </div>
                    )}
                </div>

                {/* Kolom Kanan: List Riwayat Check-in */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-175">
                    <div className="p-6 border-b bg-slate-50 font-bold flex justify-between items-center rounded-t-3xl">
                        <span className="text-slate-800 text-lg">Riwayat Masuk</span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-green-200">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Live Feed
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                        {participants.filter(p => p.status === "CHECKED-IN").map(p => (
                            <div key={p.id} className="flex justify-between items-center p-4 border-l-4 border-l-green-500 border border-slate-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                                    <div className="text-xs text-slate-500">{p.origin_school}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                        {new Date(p.check_in_time).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {participants.filter(p => p.status === "CHECKED-IN").length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <UserCheck size={64} className="mb-4 opacity-10"/>
                                <p className="text-sm font-medium">Belum ada peserta yang check-in.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* ================================================================================== */}
        {/* TAB 3: DATA PESERTA */}
        {/* ================================================================================== */}
        {activeTab === "participants" && (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in duration-300 slide-in-from-bottom-4">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5"/>
                        <input 
                            type="text" 
                            placeholder="Cari Nama / UUID / Sekolah..." 
                            onChange={e => setSearch(e.target.value)} 
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        />
                    </div>
                    <button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-green-500/20 transition-all">
                        <Download size={18}/> Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-5 w-16 text-center">No</th>
                                <th className="p-5">Nama / ID</th>
                                <th className="p-5">Sekolah</th>
                                <th className="p-5">UUID (Tiket)</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {participants.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.origin_school.toLowerCase().includes(search.toLowerCase()) || (p.ticket_code && p.ticket_code.toLowerCase().includes(search.toLowerCase()))).map((p, i) => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-5 text-center text-slate-400 font-bold">{i+1}</td>
                                    <td className="p-5">
                                        <div className="font-bold text-slate-900 text-base">{p.name}</div>
                                        <div className="text-xs text-slate-400 mt-1">{p.phone}</div>
                                    </td>
                                    <td className="p-5">
                                        <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full font-bold text-xs border border-cyan-100">{p.origin_school}</span>
                                    </td>
                                    <td className="p-5 font-mono text-xs text-slate-500">
                                        {p.ticket_code ? p.ticket_code : "-"}
                                    </td>
                                    <td className="p-5 text-slate-600">
                                        {p.status === "CHECKED-IN" ? (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-xs border border-green-200 flex w-fit items-center gap-1">
                                                <CheckCircle size={12}/> HADIR
                                            </span>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold text-xs border border-slate-200">
                                                BELUM
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-5 text-center">
                                        <button onClick={() => deleteItem('participants', p.id)} className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm">
                                            <Trash2 size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* ================================================================================== */}
        {/* TAB 4: CMS (LANDING PAGE) */}
        {/* ================================================================================== */}
        {activeTab === "cms" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300 slide-in-from-bottom-4">
                <div className="space-y-8">
                    {/* Hero Section Card */}
                    {/* ... (Di bawah penutup div Hero Section Content) ... */}

                    {/* --- KOTAK UPLOAD LOGO SEKOLAH (BARU) --- */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-3">
                            <ImageIcon size={20} className="text-cyan-600"/> Logo Sekolah / Event
                        </h3>
                        <p className="text-xs text-slate-400 mb-4">Logo ini akan muncul di pojok kiri atas website utama menggantikan logo default.</p>
                        
                        <div className="flex gap-4 items-center">
                             {/* Preview Logo Saat Ini */}
                             {settings.event_logo_url && (
                                <div className="h-20 w-20 bg-slate-50 border rounded-xl p-2 flex items-center justify-center">
                                    <img src={settings.event_logo_url} alt="Current Logo" className="max-h-full max-w-full object-contain"/>
                                </div>
                             )}
                             
                             {/* Input File */}
                             <div className="flex-1">
                                 <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-all border-slate-300">
                                    <span className="text-xs font-bold text-slate-500 text-center">
                                        {mainLogoFile ? mainLogoFile.name : "Klik untuk Pilih Logo Baru (PNG Transparan)"}
                                    </span>
                                    <input type="file" accept="image/*" onChange={e => setMainLogoFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                                 </label>
                             </div>
                        </div>
                        
                        <button 
                            onClick={handleUpdateMainLogo} 
                            disabled={loading || !mainLogoFile} 
                            className="w-full mt-4 bg-slate-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-cyan-600 transition-colors disabled:opacity-50 flex justify-center gap-2"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={16}/> : <UploadCloud size={16}/>}
                            Upload & Ganti Logo
                        </button>
                    </div>
                    {/* ------------------------------------------------ */}

                    {/* ... (Di atas kotak Video ID Setting) ... */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-10 -mt-10 z-0"></div>
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-3 relative z-10">
                            <MonitorPlay size={20} className="text-cyan-600"/> Hero Section Content
                        </h3>
                        <div className="space-y-5 relative z-10">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Judul Besar (Headline)</label>
                                <input type="text" value={settings.hero_title || ""} onChange={e => setSettings({...settings, hero_title: e.target.value})} className="w-full p-4 border border-slate-200 rounded-xl mt-2 font-bold text-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-all"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sub Judul (Description)</label>
                                <input type="text" value={settings.hero_subtitle || ""} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} className="w-full p-4 border border-slate-200 rounded-xl mt-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal Event</label>
                                    <input type="text" value={settings.event_date || ""} onChange={e => setSettings({...settings, event_date: e.target.value})} className="w-full p-4 border border-slate-200 rounded-xl mt-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"/>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lokasi Event</label>
                                    <input type="text" value={settings.event_location || ""} onChange={e => setSettings({...settings, event_location: e.target.value})} className="w-full p-4 border border-slate-200 rounded-xl mt-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VIDEO ID SETTING */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-3">
                            <Youtube size={24} className="text-red-600"/> Video Aftermovie
                        </h3>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Youtube Video ID</label>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-slate-400 text-sm font-mono bg-slate-50 p-4 rounded-xl border border-slate-200 select-none">youtube.com/watch?v=</span>
                                <input 
                                    type="text" 
                                    value={settings.youtube_video_id || ""} 
                                    onChange={e => setSettings({...settings, youtube_video_id: e.target.value})} 
                                    className="flex-1 p-4 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-red-500 outline-none placeholder:text-slate-300 font-bold text-slate-700" 
                                    placeholder="Contoh: jfKfPfyJRdk"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                                <AlertCircle size={10}/> Masukkan kode unik video dari URL Youtube (bagian setelah v=)
                            </p>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-3">
                            <BarChart3 size={20} className="text-purple-600"/> Statistik (Animated Counter)
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Jml Kampus</label>
                                <div className="text-2xl font-black text-purple-600">{campuses.length}</div>
                                <div className="text-[10px] text-slate-400 mt-1 italic">*Otomatis</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Jml Peserta</label>
                                <div className="text-2xl font-black text-blue-600">{participants.length}</div>
                                <div className="text-[10px] text-slate-400 mt-1 italic">*Otomatis</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase block text-center mb-2">Jml Speaker</label>
                                <input type="number" value={settings.stats_speakers || ""} onChange={e => setSettings({...settings, stats_speakers: e.target.value})} className="w-full p-3 border rounded-xl font-black text-2xl text-center text-orange-600 outline-none focus:border-orange-500 transition-all"/>
                                <div className="text-[10px] text-center mt-1 text-slate-400">*Manual</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Config System Card */}
                    <div className="p-8 rounded-3xl border border-slate-200 shadow-sm bg-slate-50/50">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-3">
                            <Settings size={20} className="text-slate-600"/> Konfigurasi Sistem
                        </h3>
                        
                        {/* MODE WEBSITE CONTROL */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                            <label className="text-xs font-bold text-slate-400 uppercase block mb-3">Mode Tampilan Website</label>
                            <div className="flex gap-2">
                                <button onClick={() => setSettings({...settings, site_mode: "LIVE"})} className={`flex-1 py-3 px-2 rounded-xl font-bold text-xs border transition-all flex flex-col items-center gap-2 ${settings.site_mode === "LIVE" ? "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-500/20" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"}`}>
                                    <Globe size={20}/> LIVE
                                </button>
                                <button onClick={() => setSettings({...settings, site_mode: "COMING_SOON"})} className={`flex-1 py-3 px-2 rounded-xl font-bold text-xs border transition-all flex flex-col items-center gap-2 ${settings.site_mode === "COMING_SOON" ? "bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"}`}>
                                    <Timer size={20}/> COMING SOON
                                </button>
                                <button onClick={() => setSettings({...settings, site_mode: "MAINTENANCE"})} className={`flex-1 py-3 px-2 rounded-xl font-bold text-xs border transition-all flex flex-col items-center gap-2 ${settings.site_mode === "MAINTENANCE" ? "bg-yellow-50 border-yellow-500 text-yellow-700 ring-2 ring-yellow-500/20" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"}`}>
                                    <Construction size={20}/> MAINTENANCE
                                </button>
                            </div>
                        </div>

                        {/* STATUS PENDAFTARAN CONTROL */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                            <label className="text-xs font-bold text-slate-400 uppercase block mb-3">Status Pendaftaran Form</label>
                            <div className="flex gap-4">
                                <button onClick={() => setSettings({...settings, status: "OPEN"})} className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all flex justify-center items-center gap-2 ${settings.status === "OPEN" ? "border-green-500 bg-green-50 text-green-700 shadow-md transform scale-105" : "border-slate-200 text-slate-400 hover:bg-slate-50"}`}>
                                    {settings.status === "OPEN" ? <Unlock size={20}/> : <CheckCircle size={20}/>} DIBUKA
                                </button>
                                <button onClick={() => setSettings({...settings, status: "CLOSED"})} className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all flex justify-center items-center gap-2 ${settings.status === "CLOSED" ? "border-red-500 bg-red-50 text-red-700 shadow-md transform scale-105" : "border-slate-200 text-slate-400 hover:bg-slate-50"}`}>
                                    {settings.status === "CLOSED" ? <Lock size={20}/> : <XCircle size={20}/>} DITUTUP
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Running Text (Pengumuman Atas)</label>
                            <textarea value={settings.announcement || ""} onChange={e => setSettings({...settings, announcement: e.target.value})} className="w-full p-4 border border-slate-200 rounded-xl mt-2 h-32 focus:ring-2 focus:ring-slate-900 outline-none transition-all" placeholder="Isi pengumuman penting di sini..."/>
                        </div>
                    </div>

                    {/* Kepsek Profile */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-6">Profil Kepala Sekolah</h3>
                        <div className="space-y-4">
                            <input type="text" value={settings.headmaster_name || ""} onChange={e => setSettings({...settings, headmaster_name: e.target.value})} className="w-full p-4 border border-slate-200 rounded-xl transition-all focus:ring-2 focus:ring-slate-900 outline-none" placeholder="Nama Lengkap & Gelar"/>
                            <textarea value={settings.headmaster_quote || ""} onChange={e => setSettings({...settings, headmaster_quote: e.target.value})} className="w-full p-4 border border-slate-200 rounded-xl h-28 transition-all focus:ring-2 focus:ring-slate-900 outline-none" placeholder="Kutipan Sambutan..."/>
                        </div>
                    </div>

                    <button onClick={saveSettings} disabled={loading} className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 flex justify-center items-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95">
                        {loading ? <><RefreshCw className="animate-spin"/> Menyimpan Perubahan...</> : <><Save size={20}/> SIMPAN SEMUA KONFIGURASI</>}
                    </button>
                </div>
            </div>
        )}

        {/* ================================================================================== */}
        {/* TAB 5: DATA MASTER (KAMPUS, RUNDOWN, FAQ) */}
        {/* ================================================================================== */}
        {activeTab === "data_master" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300 slide-in-from-bottom-4">
                
                {/* 1. KAMPUS MANAGER */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-212.5 lg:col-span-1">
                    <div className="p-6 border-b bg-slate-50/80 rounded-t-3xl font-bold flex justify-between items-center backdrop-blur-sm sticky top-0 z-10">
                        <span className="flex items-center gap-2 text-slate-800"><School size={20} className="text-cyan-600"/> Daftar Kampus</span>
                        <span className="bg-slate-900 text-white text-xs px-3 py-1 rounded-full font-mono">{campuses.length}</span>
                    </div>
                    
                    {/* List */}
                    <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-slate-50/30">
                        {campuses.map(c => (
                            <div key={c.id} className="flex gap-4 p-4 border border-slate-200 rounded-2xl hover:border-cyan-300 hover:shadow-md transition-all group relative bg-white">
                                <div className="w-16 h-16 rounded-xl border border-slate-100 bg-white p-2 flex items-center justify-center shadow-sm overflow-hidden">
                                    <img src={c.logo_url || "https://via.placeholder.com/150?text=LOGO"} alt={c.name} className="object-contain w-full h-full" />
                                </div>
                                <div className="flex-1 pr-6">
                                    <div className="font-bold text-slate-900 text-sm mb-1">{c.name}</div>
                                    <div className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{c.description || "Tidak ada deskripsi."}</div>
                                </div>
                                <button onClick={() => deleteItem('event_campuses', c.id)} className="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        ))}
                        {campuses.length === 0 && (
                            <div className="text-center p-10 text-slate-400 text-sm italic border-2 border-dashed border-slate-200 rounded-2xl">
                                Belum ada kampus. Tambahkan di bawah.
                            </div>
                        )}
                    </div>

                    {/* Form Input */}
                    <div className="p-6 border-t bg-white rounded-b-3xl space-y-4 shadow-[0_-5px_20px_rgba(0,0,0,0.02)] relative z-10">
                        <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-2">Tambah Partner Baru</h4>
                        
                        <label className={`flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-all ${logoFile ? 'border-cyan-500 bg-cyan-50/50' : 'border-slate-300'}`}>
                            <UploadCloud size={24} className={logoFile ? "text-cyan-600" : "text-slate-400"}/>
                            <span className="text-xs font-bold text-slate-500 truncate max-w-full px-2">{logoFile ? logoFile.name : "Upload Logo (Max 2MB)"}</span>
                            <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                        </label>

                        <input 
                            value={newCampusName} 
                            onChange={e => setNewCampusName(e.target.value)} 
                            placeholder="Nama Universitas / Instansi" 
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                        <textarea 
                            value={newCampusDesc} 
                            onChange={e => setNewCampusDesc(e.target.value)} 
                            placeholder="Deskripsi singkat untuk tooltip..." 
                            className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 h-20 resize-none transition-all"
                        />
                        
                        <button 
                            onClick={addCampus} 
                            disabled={uploading || !newCampusName} 
                            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-cyan-600 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg"
                        >
                            {uploading ? <><RefreshCw className="animate-spin" size={16}/> Mengupload...</> : <><Plus size={16}/> Simpan Data Kampus</>}
                        </button>
                    </div>
                </div>

                {/* 2. RUNDOWN & FAQ (Stacked Column) */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    
                    {/* RUNDOWN */}
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-100">
                        <div className="p-5 border-b bg-slate-50/80 rounded-t-3xl font-bold flex justify-between items-center backdrop-blur-sm">
                            <span className="flex items-center gap-2 text-slate-800"><Calendar size={18} className="text-purple-600"/> Rundown Acara</span>
                            <span className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded-full font-mono">{rundown.length}</span>
                        </div>
                        <div className="p-5 flex-1 overflow-y-auto space-y-2 bg-slate-50/30">
                            {rundown.map(r => (
                                <div key={r.id} className="flex items-center p-3 border border-slate-200 rounded-xl bg-white hover:shadow-sm transition-all group">
                                    <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold mr-4 font-mono">{r.time}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-slate-800">{r.title}</div>
                                        <div className="text-xs text-slate-500">{r.description}</div>
                                    </div>
                                    <button onClick={() => deleteItem('event_rundown', r.id)} className="text-slate-300 hover:text-red-500 p-2">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t bg-white rounded-b-3xl flex gap-3">
                            <input type="time" value={newRundown.time} onChange={e => setNewRundown({...newRundown, time: e.target.value})} className="border rounded-xl p-3 text-sm font-bold w-32 bg-slate-50"/>
                            <div className="flex-1 flex flex-col gap-2">
                                <input value={newRundown.title} onChange={e => setNewRundown({...newRundown, title: e.target.value})} placeholder="Nama Kegiatan" className="border rounded-xl p-3 text-sm font-bold w-full outline-none focus:border-purple-500"/>
                                <input value={newRundown.description} onChange={e => setNewRundown({...newRundown, description: e.target.value})} placeholder="Keterangan singkat" className="border rounded-xl p-3 text-xs w-full outline-none focus:border-purple-500"/>
                            </div>
                            <button onClick={() => addItem('event_rundown', newRundown)} disabled={!newRundown.title} className="bg-slate-900 text-white px-5 rounded-xl font-bold text-sm hover:bg-purple-600 transition-colors h-auto">
                                <Plus size={20}/>
                            </button>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-100">
                        <div className="p-5 border-b bg-slate-50/80 rounded-t-3xl font-bold flex justify-between items-center backdrop-blur-sm">
                            <span className="flex items-center gap-2 text-slate-800"><HelpCircle size={18} className="text-orange-600"/> Tanya Jawab (FAQ)</span>
                            <span className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded-full font-mono">{faqs.length}</span>
                        </div>
                        <div className="p-5 flex-1 overflow-y-auto space-y-2 bg-slate-50/30">
                            {faqs.map(f => (
                                <div key={f.id} className="p-4 border border-slate-200 rounded-xl bg-white hover:shadow-sm transition-all group relative">
                                    <div className="font-bold text-sm text-slate-900 pr-8"><span className="text-orange-500 mr-1">Q:</span> {f.question}</div>
                                    <div className="text-xs text-slate-500 mt-1 pl-4 border-l-2 border-orange-100">{f.answer}</div>
                                    <button onClick={() => deleteItem('event_faq', f.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 p-2">
                                        <Trash2 size={14}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t bg-white rounded-b-3xl space-y-3">
                            <input value={newFaq.question} onChange={e => setNewFaq({...newFaq, question: e.target.value})} placeholder="Pertanyaan baru..." className="w-full border rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500"/>
                            <div className="flex gap-3">
                                <input value={newFaq.answer} onChange={e => setNewFaq({...newFaq, answer: e.target.value})} placeholder="Jawaban..." className="flex-1 border rounded-xl p-3 text-sm outline-none focus:border-orange-500"/>
                                <button onClick={() => addItem('event_faq', newFaq)} disabled={!newFaq.question} className="bg-slate-900 text-white px-5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors">
                                    <Plus size={20}/>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </main>
    </div>
  );
}