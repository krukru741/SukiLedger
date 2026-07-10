// src/features/pos/components/SuccessToast.jsx
import React, { useState } from 'react';
import { CheckCircle, X, Send, Check, Copy } from 'lucide-react';

export default function SuccessToast({ data, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] w-11/12 max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={24} />
          <div className="flex-1">
            <p className="font-bold text-emerald-700 text-sm">Transaction Success!</p>
            <p className="text-slate-600 text-xs mt-1 leading-snug">{data.msg}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 shrink-0">
            <X size={16} />
          </button>
        </div>

        {data.sms && (
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex flex-col gap-2">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Auto-SMS / Messenger Alert</p>
            <p className="text-xs text-slate-700 italic border-l-2 border-emerald-300 pl-2">"{data.sms}"</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  const smsLink = `sms:${data.phone || ''}?body=${encodeURIComponent(data.sms)}`;
                  window.open(smsLink, '_self');
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send size={14} /> Send SMS
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(data.sms);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`border border-slate-200 font-bold py-2.5 px-3.5 rounded-xl text-xs transition flex items-center justify-center ${copied ? 'bg-emerald-500 text-white border-emerald-500' : 'text-slate-600 hover:bg-slate-50'}`}
                title="Copy Text Only"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
