// src/features/ledger/components/DetailedLedgerModal.jsx
import React from 'react';
import { X, Send, CreditCard } from 'lucide-react';

export default function DetailedLedgerModal({ selectedSuki, onClose, onSendReminder, onOpenPaymentModal }) {
  if (!selectedSuki) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center animate-fade-in md:p-4 md:items-center">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-3xl p-6 shadow-2xl flex flex-col gap-6 animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3.5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${selectedSuki.bg}`}>{selectedSuki.initial}</div>
            <div>
              <h3 className="font-black text-slate-800 text-lg">{selectedSuki.name}</h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">Total Utang: <span className="text-red-500 font-bold">₱ {selectedSuki.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>

        {/* Debt Log Section */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Debt History</p>
          <div className="flex flex-col gap-3">
            {selectedSuki.history.map((log, index) => (
              <div key={index} className={`bg-slate-50/70 border ${log.isPayment ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100'} p-4 rounded-2xl flex justify-between items-center`}>
                <div>
                  <p className={`font-bold text-sm ${log.isPayment ? 'text-emerald-600' : 'text-slate-700'}`}>{log.desc}</p>
                  <p className="text-slate-400 text-[11px] mt-1">{log.date}</p>
                </div>
                <p className={`font-bold text-sm ${log.isPayment ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {log.isPayment ? '- ₱ ' : '₱ '}{Math.abs(log.amt).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-2">
          <button
            onClick={() => onSendReminder(selectedSuki)}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm transition active:scale-98"
          >
            <Send size={16} /> Send Reminder
          </button>
          <button
            onClick={onOpenPaymentModal}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition active:scale-98"
          >
            <CreditCard size={16} /> Record Payment
          </button>
        </div>
      </div>
    </div>
  );
}
