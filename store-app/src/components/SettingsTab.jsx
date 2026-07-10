import React, { useState, useRef } from 'react';
import { Settings, Store, Camera, Wallet, MessageSquare, Save, RotateCcw, CheckCircle, Phone, User } from 'lucide-react';

export default function SettingsTab({ settings, setSettings }) {
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('store');
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLocalSettings(prev => ({ ...prev, logo: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const SMS_VARS = ['{name}', '{balance}', '{storeName}'];

  const sections = [
    { id: 'store', label: 'Store Info', icon: Store },
    { id: 'cash', label: 'Starting Cash', icon: Wallet },
    { id: 'sms', label: 'SMS Template', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 pb-24">
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white pt-8 pb-8 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-36 h-36 bg-white/5 rounded-full blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-xl">
            <Settings size={22} className="text-slate-300" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-wide">Settings</h2>
            <p className="text-slate-400 text-xs mt-0.5">I-configure ang imong tindahan</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-5 flex flex-col gap-5">
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={lex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 }
              >
                <Icon size={13} />{s.label}
              </button>
            );
          })}
        </div>

        {activeSection === 'store' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Store Logo & Name</p>
              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-dashed border-emerald-300 flex items-center justify-center cursor-pointer hover:bg-emerald-100 transition overflow-hidden"
                  >
                    {localSettings.logo
                      ? <img src={localSettings.logo} alt="logo" className="w-full h-full object-cover" />
                      : <Camera size={28} className="text-emerald-400" />
                    }
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow">
                    <Camera size={12} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-600 mb-1">Store Logo</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">I-tap para mag-upload og logo para sa imong tindahan.</p>
                  {localSettings.logo && (
                    <button onClick={() => setLocalSettings(p => ({ ...p, logo: '' }))} className="text-[10px] text-red-400 mt-1 font-bold">Remove logo</button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Store Name</label>
                  <input type="text" value={localSettings.storeName} onChange={e => setLocalSettings(p => ({ ...p, storeName: e.target.value }))} placeholder="e.g., Tindahan ni Aling Nena" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Owner Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-3.5 text-slate-400" />
                    <input type="text" value={localSettings.ownerName} onChange={e => setLocalSettings(p => ({ ...p, ownerName: e.target.value }))} placeholder="e.g., Maria Santos" className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-3.5 text-slate-400" />
                    <input type="text" value={localSettings.ownerPhone} onChange={e => setLocalSettings(p => ({ ...p, ownerPhone: e.target.value }))} placeholder="e.g., 09123456789" className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'cash' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starting Cash / Drawer Setup</p>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-emerald-700 mb-1">Unsa kini?</p>
              <p className="text-[11px] text-emerald-600 leading-relaxed">Kini ang kantidad nga sinsilyo nga anaa na sa kahon sa pagsugod sa matag adlaw. Gamiton kini para kalkulahon ang tinuod nga halin sa cashier.</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Default Starting Cash</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">&#x20b1;</span>
                <input type="number" step="50" value={localSettings.startingCash} onChange={e => setLocalSettings(p => ({ ...p, startingCash: parseFloat(e.target.value) || 0 }))} className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-3.5 rounded-2xl font-extrabold text-xl text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets</p>
            <div className="grid grid-cols-3 gap-2">
              {[200, 500, 1000, 1500, 2000, 5000].map(amt => (
                <button key={amt} onClick={() => setLocalSettings(p => ({ ...p, startingCash: amt }))} className={py-2.5 rounded-xl border text-sm font-bold transition }>
                  &#x20b1;{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'sms' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">SMS Reminder Template</p>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 mb-4">
                <p className="text-[10px] font-bold text-blue-600 mb-1.5">Available Variables — i-tap para idugang:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SMS_VARS.map(v => (
                    <button key={v} onClick={() => setLocalSettings(p => ({ ...p, smsTemplate: p.smsTemplate + v }))} className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-blue-200 hover:bg-blue-200 transition">{v}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Template Message</label>
                <textarea rows="5" value={localSettings.smsTemplate} onChange={e => setLocalSettings(p => ({ ...p, smsTemplate: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition resize-none" />
              </div>
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Preview</p>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  {(localSettings.smsTemplate || '').replace('{name}', 'Aling Nena').replace('{balance}', '&#x20b1;1,200.00').replace('{storeName}', localSettings.storeName || 'ang tindahan')}
                </p>
              </div>
              <button onClick={() => setLocalSettings(p => ({ ...p, smsTemplate: 'Maayong adlaw, {name}! Reminder lang gikan sa {storeName} bahin sa imong kasamtangang utang ledger nga nagkantidad og {balance}. Pwede ra nimo ma-settle sa tindahan kung hayahay na ka. Salamat kaayo!' }))} className="mt-3 text-[10px] text-slate-400 underline font-medium">Reset to default template</button>
            </div>
          </div>
        )}

        <div className="flex gap-3 pb-6">
          <button onClick={() => setLocalSettings({ ...settings })} className="flex items-center gap-2 px-4 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-2xl text-sm hover:bg-slate-200 transition">
            <RotateCcw size={15} /> Reset
          </button>
          <button onClick={handleSave} className={lex-1 flex items-center justify-center gap-2 py-3.5 font-bold rounded-2xl text-sm transition shadow-md }>
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
