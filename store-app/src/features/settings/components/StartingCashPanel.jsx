// src/features/settings/components/StartingCashPanel.jsx
import React from 'react';

export default function StartingCashPanel({ localSettings, setLocalSettings }) {
  return (
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
          <button key={amt} onClick={() => setLocalSettings(p => ({ ...p, startingCash: amt }))} className={"py-2.5 rounded-xl border text-sm font-bold transition " + (localSettings.startingCash === amt ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-300')}>
            &#x20b1;{amt.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}
