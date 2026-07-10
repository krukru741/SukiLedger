// src/features/ledger/components/RecordPaymentModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function RecordPaymentModal({ selectedSuki, onClose, onSave }) {
  const [paymentAmount, setPaymentAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) return;
    onSave(amt);
    setPaymentAmount('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-xs overflow-hidden shadow-2xl">
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="font-bold">Record Payment</h3>
          <button onClick={onClose} className="bg-emerald-500/30 p-1 rounded-full hover:bg-emerald-500/50">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Current Balance:</p>
            <p className="text-lg font-bold text-red-500 mb-4">₱ {selectedSuki?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>

            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Amount Paid (₱)</label>
            <input
              type="number"
              step="0.01"
              autoFocus
              required
              placeholder="0.00"
              value={paymentAmount}
              onChange={e => setPaymentAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-bold text-lg text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
            />
          </div>
          <button
            type="submit"
            disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
            className={`w-full font-bold py-3 rounded-xl transition ${paymentAmount && parseFloat(paymentAmount) > 0
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
          >
            Save Payment
          </button>
        </form>
      </div>
    </div>
  );
}
