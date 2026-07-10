// src/features/settings/components/SmsTemplatePanel.jsx
import React from 'react';

const SMS_VARS = ['{name}', '{balance}', '{storeName}'];

export default function SmsTemplatePanel({ localSettings, setLocalSettings }) {
  return (
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
  );
}
