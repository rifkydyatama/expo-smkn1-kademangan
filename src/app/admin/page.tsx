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
  Construction, 
  Timer,        
  Globe,        
  Bell,         
  ShieldCheck,  
  Image as ImageIcon 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. DEFINISI TIPE DATA ---
type Participant = { 
  id: number; 
  name: string; 
  origin_school: string; 
  email: string; 
  phone: string; 
  created_at: string;
  status: string;          
  check_in_time: string;   
  ticket_code?: string;    
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
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [rundown, setRundown] = useState<Rundown[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [settings, setSettings] = useState<any>({});
  
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });

  const showNotify = (message: string, type: "info" | "error" | "success" = "info") => {
      setNotification({ show: true, message, type });
      setTimeout(() => setNotification({ show: false, message: "", type: "info" }), 4000); // 4 detik biar kebaca
  };

  // --- 3. STATE KHUSUS FITUR ---
  const [scanId, setScanId] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanStatus, setScanStatus] = useState<"IDLE" | "SUCCESS" | "ERROR" | "USED">("IDLE");

  const [newRundown, setNewRundown] = useState({ time: "", title: "", description: "" });
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  const [newCampusName, setNewCampusName] = useState("");
  const [newCampusDesc, setNewCampusDesc] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mainLogoFile, setMainLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // --- 4. LOGIN SYSTEM ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin" && password === "admin123") {
      setSession(true);
      fetchAllData();
      showNotify("Login Berhasil! Mengambil data...", "success");
    } else { 
      showNotify("Username/Password Salah!", "error");
    }
  };

  // --- 5. DATA FETCHING (DEBUG MODE) ---
  const fetchAllData = async () => {
    setRefreshing(true);
    try {
        console.log("Fetching Data...");
        
        // 1. Settings
        const { data: s, error: sErr } = await supabase.from("event_settings").select("*");
        if (sErr) throw new Error("Gagal load Settings: " + sErr.message);
        
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

        console.log("Data Loaded:", { conf, pCount: p?.length });

    } catch (error: any) {
        console.error("Fetch Error:", error);
        showNotify(error.message || "Gagal koneksi database", "error");
    } finally {
        setRefreshing(false);
    }
  };

  // --- 6. GATE CHECK-IN ---
  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setScanResult(null);
    
    let cleanId = scanId.trim();
    if (cleanId.toUpperCase().startsWith("EXPO-")) cleanId = cleanId.replace(/EXPO-/i, "");

    if (!cleanId) { setLoading(false); return; }

    let user = null;
    if (!isNaN(Number(cleanId))) {
         const { data } = await supabase.from("participants").select("*").eq("id", cleanId).single();
         user = data;
    } 
    if (!user) {
         const { data } = await supabase.from("participants").select("*").eq("ticket_code", cleanId).single();
         user = data;
    }

    if (!user) {
        setScanStatus("ERROR"); 
        showNotify("Tiket TIDAK DITEMUKAN di Database!", "error");
    } else if (user.status === "CHECKED-IN") {
        setScanResult(user);
        setScanStatus("USED");
        showNotify(`Tiket a.n ${user.name} SUDAH MASUK!`, "error");
    } else {
        const { error } = await supabase.from("participants").update({ status: "CHECKED-IN", check_in_time: new Date().toISOString() }).eq("id", user.id);
        
        if (error) {
            showNotify("Gagal Check-in: " + error.message, "error");
        } else {
            setScanResult(user);
            setScanStatus("SUCCESS");
            showNotify(`✅ Masuk: ${user.name}`, "success");
            fetchAllData(); 
        }
    }
    setScanId(""); setLoading(false);
  };

  // --- 7. UPLOAD SYSTEM (FIXED) ---
  const handleUploadImage = async (file: File): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        // Nama file acak biar gak bentrok
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        // Upload
        const { error: uploadError } = await supabase.storage
            .from('campus-logos')
            .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data } = supabase.storage
            .from('campus-logos')
            .getPublicUrl(fileName);

        return data.publicUrl;
    } catch (error: any) {
        showNotify("Upload Gagal: " + error.message, "error");
        return null;
    }
  };

  // UPDATE LOGO UTAMA (DEBUGGED)
  const handleUpdateMainLogo = async () => {
     if (!mainLogoFile) return showNotify("Pilih gambar logo dulu!", "error");
     setLoading(true);
     
     const url = await handleUploadImage(mainLogoFile);
     
     if (url) {
         console.log("Logo Uploaded URL:", url);
         // Insert ke Database dengan Error Checking
         const { error } = await supabase
            .from("event_settings")
            .upsert({ key: "event_logo_url", value: url }, { onConflict: 'key' });

         if (error) {
             console.error("DB Error:", error);
             showNotify("Gagal Simpan ke DB: " + error.message, "error");
         } else {
             setMainLogoFile(null);
             showNotify("Logo Berhasil Diupdate! Refresh web utama.", "success");
             fetchAllData();
         }
     }
     setLoading(false);
  };

  // --- 8. CRUD ACTIONS ---
  const saveSettings = async () => {
    setLoading(true);
    let errorCount = 0;
    for (const [key, value] of Object.entries(settings)) {
       const { error } = await supabase.from("event_settings").upsert({ key, value: String(value) }, { onConflict: 'key' });
       if (error) errorCount++;
    }
    setLoading(false); 
    if (errorCount > 0) showNotify(`Ada ${errorCount} setting gagal disimpan! Cek console.`, "error");
    else showNotify("Semua Konfigurasi Tersimpan!", "success");
    fetchAllData();
  };

  const addCampus = async () => {
    if (!newCampusName) return showNotify("Nama Kampus Wajib Diisi!", "error");
    setUploading(true);
    let finalUrl = "";
    if (logoFile) {
        const url = await handleUploadImage(logoFile);
        if (url) finalUrl = url;
    }
    const { error } = await supabase.from("event_campuses").insert({ name: newCampusName, description: newCampusDesc, logo_url: finalUrl });
    
    if (error) showNotify("Gagal tambah kampus: " + error.message, "error");
    else {
        setNewCampusName(""); setNewCampusDesc(""); setLogoFile(null); 
        showNotify("Kampus ditambahkan", "success");
        fetchAllData();
    }
    setUploading(false); 
  };

  const addItem = async (table: string, data: any) => {
    const { error } = await supabase.from(table).insert(data);
    if (error) showNotify("Gagal tambah data: " + error.message, "error");
    else {
        setNewRundown({time:"", title:"", description:""}); setNewFaq({question:"", answer:""});
        showNotify("Data berhasil ditambahkan", "success");
        fetchAllData();
    }
  };

  const deleteItem = async (table: string, id: number) => {
    if(confirm("Hapus data ini?")) { 
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) showNotify("Gagal hapus: " + error.message, "error");
        else {
            showNotify("Data terhapus", "success");
            fetchAllData(); 
        }
    }
  };

  const downloadCSV = () => {
    const headers = ["ID,UUID,Nama,Sekolah,Email,No HP,Status,Waktu Check-in"];
    const rows = participants.map(p => `${p.id},"${p.ticket_code || '-'}","${p.name}","${p.origin_school}","${p.email}","${p.phone}","${p.status}","${p.check_in_time || "-"}"`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a"); link.href = encodeURI(csvContent); link.download = `Laporan_Expo.csv`; link.click();
    showNotify("Laporan CSV diunduh!", "success");
  };

  // --- RENDER UI ---
  if (!session) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
      <AnimatePresence>
        {notification.show && (
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className={`fixed top-10 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 font-bold text-sm ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                {notification.type === 'error' ? <AlertCircle size={18}/> : <CheckCircle size={18}/>} {notification.message}
            </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
        <div className="text-center mb-10"><h1 className="text-3xl font-black text-slate-800 tracking-tight">ADMIN PRO</h1><p className="text-slate-500 text-sm mt-2">SMKN 1 Kademangan</p></div>
        <form onSubmit={handleLogin} className="space-y-5"><input autoFocus type="text" onChange={e => setEmail(e.target.value)} placeholder="Username" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold outline-none focus:border-cyan-500"/><input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold outline-none focus:border-cyan-500"/><button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-cyan-600 shadow-lg mt-4">MASUK DASHBOARD</button></form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <AnimatePresence>
        {notification.show && (
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className={`fixed bottom-10 right-10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[100] border-l-8 ${notification.type === 'error' ? 'bg-white border-red-500 text-red-600' : 'bg-slate-900 border-cyan-500 text-white'}`}>
                <div><h4 className="font-bold text-sm uppercase">{notification.type === 'error' ? 'GAGAL' : 'BERHASIL'}</h4><p className="text-xs font-medium opacity-90">{notification.message}</p></div>
                <button onClick={() => setNotification({ ...notification, show: false })}><XCircle size={18}/></button>
            </motion.div>
        )}
      </AnimatePresence>

      <aside className="w-72 bg-white border-r border-slate-200 flex-col hidden md:flex fixed h-full z-20 shadow-sm">
        <div className="p-8 border-b border-slate-100"><div className="font-black text-2xl tracking-tighter text-slate-900">EXPO<span className="text-cyan-600">ADMIN</span></div><div className="text-[10px] font-bold text-slate-400 mt-1 tracking-widest flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>SYSTEM V10.0</div></div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[{id: "dashboard", label: "Overview", icon: LayoutDashboard}, {id: "scanner", label: "Gate Scanner", icon: ShieldCheck}, {id: "participants", label: "Data Peserta", icon: Users}, {id: "cms", label: "Edit Landing Page", icon: MonitorPlay}, {id: "data_master", label: "Data Master", icon: Settings}].map(m => (
                <button key={m.id} onClick={() => setActiveTab(m.id)} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold transition-all ${activeTab === m.id ? "bg-slate-900 text-white shadow-lg translate-x-1" : "text-slate-500 hover:bg-slate-50"}`}><m.icon size={18} /> {m.label}</button>
            ))}
        </nav>
        <div className="p-4 border-t border-slate-100"><button onClick={() => setSession(false)} className="w-full flex items-center gap-2 px-5 py-4 text-red-500 font-bold hover:bg-red-50 rounded-xl text-sm transition-colors"><LogOut size={18}/> Keluar Sistem</button></div>
      </aside>

      <main className="ml-0 md:ml-72 flex-1 p-8 md:p-10 transition-all">
        <div className="flex justify-between items-center mb-10">
            <div><h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{activeTab.replace(/_/g, " ")}</h2><p className="text-slate-500 text-sm mt-1">Status: <strong>{settings.site_mode}</strong></p></div>
            <button onClick={fetchAllData} className={`p-3 bg-white border rounded-xl text-slate-600 hover:text-cyan-600 shadow-sm ${refreshing ? "animate-spin" : ""}`}><RefreshCw size={20}/></button>
        </div>

        {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white p-6 rounded-3xl border shadow-sm"><div className="text-5xl font-black text-slate-900">{participants.length}</div><div className="text-sm text-slate-500 font-bold mt-2">Total Pendaftar</div></div>
                <div className="bg-green-50 p-6 rounded-3xl border border-green-200 shadow-sm"><div className="text-5xl font-black text-green-700">{participants.filter(p => p.status === "CHECKED-IN").length}</div><div className="text-sm text-green-700 font-bold mt-2">Peserta Hadir</div></div>
                <div className={`p-6 rounded-3xl border shadow-sm text-white flex flex-col justify-between ${settings.site_mode === "LIVE" ? "bg-green-600" : settings.site_mode === "MAINTENANCE" ? "bg-yellow-600" : "bg-blue-600"}`}><div className="font-bold opacity-80 flex items-center gap-2"><Settings size={16}/> SITE MODE</div><div className="text-3xl font-black tracking-widest mt-4">{settings.site_mode}</div></div>
                <div className="md:col-span-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mt-4">
                    <h3 className="font-bold text-xl text-slate-900 mb-6">Pendaftar Terbaru</h3>
                    <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 font-bold uppercase"><tr><th className="p-4">Nama</th><th className="p-4">Sekolah</th><th className="p-4">Kode Tiket (UUID)</th><th className="p-4">Status</th></tr></thead><tbody className="divide-y divide-slate-50">{participants.slice(0,5).map(p => (<tr key={p.id}><td className="p-4 font-bold">{p.name}</td><td className="p-4 text-slate-500">{p.origin_school}</td><td className="p-4 font-mono text-xs text-slate-400">{p.ticket_code}</td><td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${p.status === "CHECKED-IN" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>{p.status}</span></td></tr>))}</tbody></table></div>
                </div>
            </div>
        )}

        {activeTab === "scanner" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border shadow-lg border-slate-200">
                        <h3 className="font-black text-xl mb-4 flex items-center gap-2 text-slate-800"><ShieldCheck className="text-cyan-600" size={24}/> SECURE SCANNER</h3>
                        <form onSubmit={handleCheckIn}><input autoFocus value={scanId} onChange={e => setScanId(e.target.value)} placeholder="Klik disini & Scan QR..." className="w-full p-6 bg-slate-50 border-2 rounded-2xl text-xl font-bold text-center outline-none focus:border-cyan-500 placeholder:text-slate-300"/><button disabled={loading} className="w-full mt-4 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-cyan-600 transition-colors shadow-lg disabled:opacity-70">{loading ? "MEMERIKSA..." : "VERIFIKASI KODE"}</button></form>
                    </div>
                    {scanStatus === "SUCCESS" && scanResult && (<div className="bg-green-100 border-2 border-green-200 p-8 rounded-3xl text-center"><CheckCircle size={48} className="mx-auto text-green-600 mb-4"/><h2 className="text-4xl font-black text-green-700">TIKET VALID!</h2><div className="mt-6 bg-white p-4 rounded-xl text-left"><div className="text-xs text-slate-400 uppercase">Nama</div><div className="text-xl font-bold text-slate-900">{scanResult.name}</div></div></div>)}
                    {scanStatus === "USED" && scanResult && (<div className="bg-orange-50 border-2 border-orange-200 p-8 rounded-3xl text-center"><AlertCircle size={48} className="mx-auto text-orange-500 mb-4"/><h2 className="text-3xl font-black text-orange-700">SUDAH DIPAKAI!</h2></div>)}
                    {scanStatus === "ERROR" && (<div className="bg-red-50 border-2 border-red-200 p-8 rounded-3xl text-center"><XCircle size={48} className="mx-auto text-red-500 mb-4"/><h2 className="text-3xl font-black text-red-700">TIKET PALSU!</h2></div>)}
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[600px]"><div className="p-6 border-b bg-slate-50 rounded-t-3xl font-bold">Riwayat Masuk (Live)</div><div className="flex-1 overflow-y-auto p-4 space-y-3">{participants.filter(p => p.status === "CHECKED-IN").map(p => (<div key={p.id} className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-sm"><div><div className="font-bold text-sm">{p.name}</div></div><div className="text-xs font-mono bg-green-50 text-green-700 px-2 py-1 rounded">{new Date(p.check_in_time).toLocaleTimeString()}</div></div>))}</div></div>
            </div>
        )}

        {activeTab === "participants" && (
            <div className="bg-white border rounded-3xl shadow-sm overflow-hidden animate-in fade-in"><div className="p-6 border-b flex gap-4"><div className="relative w-96"><Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5"/><input type="text" placeholder="Cari Nama / UUID..." onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl font-medium outline-none focus:ring-2 focus:ring-slate-900"/></div><button onClick={downloadCSV} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"><Download size={18}/> Export CSV</button></div><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 font-bold uppercase"><tr><th className="p-5">Nama / ID</th><th className="p-5">Sekolah</th><th className="p-5">UUID (Tiket)</th><th className="p-5">Status</th><th className="p-5 text-center">Aksi</th></tr></thead><tbody className="divide-y divide-slate-100">{participants.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.ticket_code?.toLowerCase().includes(search.toLowerCase())).map((p) => (<tr key={p.id} className="hover:bg-slate-50"><td className="p-5"><div className="font-bold text-slate-900">{p.name}</div><div className="text-xs text-slate-400">{p.phone}</div></td><td className="p-5">{p.origin_school}</td><td className="p-5 font-mono text-xs text-slate-500">{p.ticket_code ? p.ticket_code.substring(0,8)+"..." : "-"}</td><td className="p-5">{p.status === "CHECKED-IN" ? <span className="text-green-600 font-bold flex gap-1"><CheckCircle size={14}/> HADIR</span> : <span className="text-slate-400 font-bold">BELUM</span>}</td><td className="p-5 text-center"><button onClick={() => deleteItem('participants', p.id)} className="p-2 bg-white border text-slate-400 rounded-lg hover:text-red-500"><Trash2 size={18}/></button></td></tr>))}</tbody></table></div></div>
        )}

        {activeTab === "cms" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl border shadow-sm"><h3 className="font-bold text-lg mb-6 flex items-center gap-2"><MonitorPlay size={20}/> Hero Content</h3><div className="space-y-4"><input type="text" value={settings.hero_title || ""} onChange={e => setSettings({...settings, hero_title: e.target.value})} className="w-full p-4 border rounded-xl font-bold"/><input type="text" value={settings.hero_subtitle || ""} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} className="w-full p-4 border rounded-xl"/><div className="grid grid-cols-2 gap-4"><input type="text" value={settings.event_date || ""} onChange={e => setSettings({...settings, event_date: e.target.value})} className="w-full p-4 border rounded-xl"/><input type="text" value={settings.event_location || ""} onChange={e => setSettings({...settings, event_location: e.target.value})} className="w-full p-4 border rounded-xl"/></div></div></div>
                    
                    {/* UPLOAD LOGO */}
                    <div className="bg-white p-8 rounded-3xl border shadow-sm relative overflow-hidden">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-3"><ImageIcon size={20} className="text-cyan-600"/> Logo Sekolah</h3>
                        <div className="flex gap-4 items-center">{settings.event_logo_url && <img src={settings.event_logo_url} className="h-16 w-16 object-contain bg-slate-50 border rounded-xl p-2"/>}<div className="flex-1"><label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 border-slate-300"><span className="text-xs font-bold text-slate-500">{mainLogoFile ? mainLogoFile.name : "Pilih Logo (PNG)"}</span><input type="file" accept="image/*" onChange={e => setMainLogoFile(e.target.files ? e.target.files[0] : null)} className="hidden" /></label></div></div>
                        <button onClick={handleUpdateMainLogo} disabled={loading || !mainLogoFile} className="w-full mt-4 bg-slate-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-cyan-600 disabled:opacity-50">Upload & Ganti Logo</button>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border shadow-sm"><h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Youtube size={20}/> Video ID</h3><input type="text" value={settings.youtube_video_id || ""} onChange={e => setSettings({...settings, youtube_video_id: e.target.value})} className="w-full p-4 border rounded-xl font-mono" placeholder="Kode Youtube (ex: jfKfPfyJRdk)"/></div>
                </div>
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl border shadow-sm">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Settings size={20}/> Konfigurasi Sistem</h3>
                        <div className="mb-6"><div className="flex gap-2"><button onClick={() => setSettings({...settings, site_mode: "LIVE"})} className={`flex-1 py-3 border rounded-xl font-bold text-xs ${settings.site_mode === "LIVE" ? "bg-green-50 border-green-500 text-green-700" : "bg-white text-slate-400"}`}>LIVE</button><button onClick={() => setSettings({...settings, site_mode: "MAINTENANCE"})} className={`flex-1 py-3 border rounded-xl font-bold text-xs ${settings.site_mode === "MAINTENANCE" ? "bg-yellow-50 border-yellow-500 text-yellow-700" : "bg-white text-slate-400"}`}>MAINTENANCE</button></div></div>
                        <textarea value={settings.announcement || ""} onChange={e => setSettings({...settings, announcement: e.target.value})} className="w-full p-4 border rounded-xl h-24" placeholder="Running text..."/>
                    </div>
                    <button onClick={saveSettings} disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-transform">{loading ? "Menyimpan..." : "SIMPAN KONFIGURASI"}</button>
                </div>
            </div>
        )}

        {activeTab === "data_master" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
                <div className="bg-white border rounded-3xl shadow-sm h-[800px] flex flex-col"><div className="p-6 border-b font-bold">Kampus Manager</div><div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">{campuses.map(c => (<div key={c.id} className="p-4 border rounded-xl bg-white relative group"><div className="w-12 h-12 mb-2 p-1 border rounded bg-white flex items-center justify-center"><img src={c.logo_url} className="max-w-full max-h-full"/></div><div className="font-bold text-sm">{c.name}</div><button onClick={() => deleteItem('event_campuses', c.id)} className="absolute top-2 right-2 text-red-300 hover:text-red-500"><Trash2 size={16}/></button></div>))}</div><div className="p-4 border-t space-y-3"><input value={newCampusName} onChange={e => setNewCampusName(e.target.value)} placeholder="Nama Kampus" className="w-full p-3 border rounded-xl text-sm"/><button onClick={addCampus} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">Tambah Kampus</button></div></div>
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border rounded-3xl shadow-sm h-[400px] flex flex-col"><div className="p-6 border-b font-bold">Rundown Acara</div><div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">{rundown.map(r => (<div key={r.id} className="flex items-center p-3 border rounded-xl bg-white"><div className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold mr-3">{r.time}</div><div className="flex-1"><div className="font-bold text-sm">{r.title}</div></div><button onClick={() => deleteItem('event_rundown', r.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button></div>))}</div><div className="p-4 border-t flex gap-2"><input type="time" value={newRundown.time} onChange={e => setNewRundown({...newRundown, time: e.target.value})} className="border rounded-xl p-2"/><input value={newRundown.title} onChange={e => setNewRundown({...newRundown, title: e.target.value})} placeholder="Judul Acara" className="border rounded-xl p-2 flex-1"/><button onClick={() => addItem('event_rundown', newRundown)} className="bg-slate-900 text-white p-2 rounded-xl"><Plus size={20}/></button></div></div>
                    <div className="bg-white border rounded-3xl shadow-sm h-[400px] flex flex-col"><div className="p-6 border-b font-bold">FAQ Manager</div><div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">{faqs.map(f => (<div key={f.id} className="p-3 border rounded-xl bg-white relative"><div className="font-bold text-sm pr-6">Q: {f.question}</div><div className="text-xs text-slate-500 mt-1">A: {f.answer}</div><button onClick={() => deleteItem('event_faq', f.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={14}/></button></div>))}</div><div className="p-4 border-t flex gap-2"><input value={newFaq.question} onChange={e => setNewFaq({...newFaq, question: e.target.value})} placeholder="Tanya..." className="border rounded-xl p-2 flex-1"/><input value={newFaq.answer} onChange={e => setNewFaq({...newFaq, answer: e.target.value})} placeholder="Jawab..." className="border rounded-xl p-2 flex-1"/><button onClick={() => addItem('event_faq', newFaq)} className="bg-slate-900 text-white p-2 rounded-xl"><Plus size={20}/></button></div></div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}