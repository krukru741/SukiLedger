import React from 'react';
import { Check } from 'lucide-react';

const SMS_VARS = ['{name}', '{balance}', '{storeName}'];

export default function SmsTemplatePanel({ localSettings, setLocalSettings }) {
  const removedContext = React.useRef({});

  const handleToggleVariable = (v) => {
    setLocalSettings(p => {
      let current = p.smsTemplate || '';
      const isAdded = current.includes(v);

      if (isAdded) {
        // Save the context (up to 20 chars before the variable) to know where to put it back
        const index = current.indexOf(v);
        const prefix = current.slice(Math.max(0, index - 20), index);
        removedContext.current[v] = prefix;
        
        return { ...p, smsTemplate: current.replaceAll(v, '') };
      } else {
        // Try to find the prefix and put it right after
        const prefix = removedContext.current[v];
        if (prefix && current.includes(prefix)) {
          const insertPos = current.indexOf(prefix) + prefix.length;
          const newStr = current.slice(0, insertPos) + v + current.slice(insertPos);
          return { ...p, smsTemplate: newStr };
        } else {
          // Fallback to appending at the end
          return { ...p, smsTemplate: current + (current.endsWith(' ') ? '' : ' ') + v };
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">SMS Reminder Template</p>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 mb-4">
          <p className="text-[10px] font-bold text-blue-600 mb-1.5">Available Variables — i-tap para idugang/tangtangon:</p>
          <div className="flex flex-wrap gap-2">
            {SMS_VARS.map(v => {
              const isAdded = (localSettings.smsTemplate || '').includes(v);
              return (
                <button 
                  key={v} 
                  onClick={() => handleToggleVariable(v)} 
                  className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-xl border transition ${isAdded ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                >
                  {isAdded && <Check size={12} strokeWidth={3} />}
                  {v}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Template Message</label>
          <textarea rows="5" value={localSettings.smsTemplate} onChange={e => setLocalSettings(p => ({ ...p, smsTemplate: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition resize-none" />
        </div>
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Preview</p>
          <p className="text-xs text-slate-700 italic leading-relaxed">
            {(localSettings.smsTemplate || '').replaceAll('{name}', 'Aling Nena').replaceAll('{balance}', '₱1,200.00').replaceAll('{storeName}', localSettings.storeName || 'ang tindahan')}
          </p>
        </div>
        <button onClick={() => setLocalSettings(p => ({ ...p, smsTemplate: 'Maayong adlaw, {name}! Reminder lang gikan sa {storeName} bahin sa imong kasamtangang utang ledger nga nagkantidad og {balance}. Pwede ra nimo ma-settle sa tindahan kung hayahay na ka. Salamat kaayo!' }))} className="mt-3 text-[10px] text-slate-400 underline font-medium">Reset to default template</button>
      </div>
    </div>
  );
}
