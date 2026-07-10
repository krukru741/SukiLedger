// src/components/SettingsTab.jsx
import React, { useState } from 'react';
import { Settings, Store, Wallet, MessageSquare, Save, RotateCcw, CheckCircle } from 'lucide-react';
import StoreInfoPanel from '../features/settings/components/StoreInfoPanel';
import StartingCashPanel from '../features/settings/components/StartingCashPanel';
import SmsTemplatePanel from '../features/settings/components/SmsTemplatePanel';

export default function SettingsTab({ settings, setSettings }) {
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('store');

  const handleSave = () => {
    setSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

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
                className={"flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 " + (activeSection === s.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
              >
                <Icon size={13} />{s.label}
              </button>
            );
          })}
        </div>

        {activeSection === 'store' && (
          <StoreInfoPanel localSettings={localSettings} setLocalSettings={setLocalSettings} />
        )}

        {activeSection === 'cash' && (
          <StartingCashPanel localSettings={localSettings} setLocalSettings={setLocalSettings} />
        )}

        {activeSection === 'sms' && (
          <SmsTemplatePanel localSettings={localSettings} setLocalSettings={setLocalSettings} />
        )}

        <div className="flex gap-3 pb-6">
          <button onClick={() => setLocalSettings({ ...settings })} className="flex items-center gap-2 px-4 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-2xl text-sm hover:bg-slate-200 transition">
            <RotateCcw size={15} /> Reset
          </button>
          <button onClick={handleSave} className={"flex-1 flex items-center justify-center gap-2 py-3.5 font-bold rounded-2xl text-sm transition shadow-md " + (saved ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-slate-900 text-white hover:bg-slate-800')}>
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
