// src/features/pos/components/CashPaymentModal.jsx
import React from 'react';
import { X } from 'lucide-react';

export default function CashPaymentModal({ cartTotal, cashReceived, setCashReceived, onConfirm, onClose }) {
  const received = parseFloat(cashReceived) || 0;
  const change = Math.max(0, received - cartTotal);
  const isInsufficient = received < cartTotal;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-emerald-600 px-6 py-5 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Cash Payment</h3>
          <button onClick={onClose} className="bg-emerald-500/30 p-1.5 rounded-full hover:bg-emerald-500/50">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Due</p>
            <p className="text-2xl font-black text-slate-800">₱{cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1000, 500, 200, 100, 50].map(amt => (
              <button
                key={amt}
                onClick={() => setCashReceived(amt.toString())}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2.5 rounded-xl border border-emerald-100 transition shadow-sm active:scale-95"
              >
                ₱{amt}
              </button>
            ))}
            <button
              onClick={() => setCashReceived(cartTotal.toString())}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition shadow-sm active:scale-95"
            >
              Exact
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cash Received</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₱</span>
              <input
                type="number"
                value={cashReceived}
                onChange={e => setCashReceived(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-8 pr-4 py-3.5 rounded-2xl font-black text-xl text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sukli (Change)</p>
            <p className={`text-4xl font-black ${!isInsufficient ? 'text-emerald-600' : 'text-red-500'}`}>
              ₱{change.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            {isInsufficient && <p className="text-red-500 text-xs font-bold mt-2">Kuwang ang kwarta!</p>}
          </div>

          <button
            onClick={onConfirm}
            disabled={isInsufficient}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition mt-2 text-lg"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
