// src/features/settings/components/StoreInfoPanel.jsx
import React, { useRef } from 'react';
import { Camera, User, Phone } from 'lucide-react';

export default function StoreInfoPanel({ localSettings, setLocalSettings }) {
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

  return (
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
  );
}
