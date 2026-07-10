// src/features/pos/components/CartPanel.jsx
import React from 'react';
import { ShoppingCart, X, ChevronRight } from 'lucide-react';

export default function CartPanel({ cart, cartTotal, onPayCash, onChargeToSuki, onClear }) {
  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-[4.5rem] md:bottom-6 left-0 right-0 px-4 md:px-0 md:max-w-4xl md:mx-auto z-40 animate-slide-up">
      <div className="bg-slate-900 rounded-3xl p-5 shadow-2xl flex flex-col gap-3 border border-slate-700">
        {/* Receipt Header */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400">
              <ShoppingCart size={18} />
            </div>
            <h3 className="font-bold text-white text-base tracking-wide">Transaction</h3>
          </div>
          <button onClick={onClear} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white transition">
            <X size={16} />
          </button>
        </div>

        {/* Receipt Items (Scrollable if too many) */}
        <div className="flex flex-col gap-2.5 max-h-36 overflow-y-auto pr-1 font-mono text-sm text-slate-300">
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start gap-4">
              <span className="truncate">{item.qty}x {item.name}</span>
              <span className="whitespace-nowrap">- ₱ {(item.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>

        {/* Receipt Total */}
        <div className="border-t-2 border-dashed border-slate-600 pt-3 pb-3 flex justify-between items-end font-mono">
          <span className="font-bold text-slate-300 text-lg">Total</span>
          <span className="font-black text-white text-2xl relative">
            ₱ {cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            {/* Double Underline typical of receipts */}
            <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white rounded-full"></div>
            <div className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-white rounded-full"></div>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            onClick={onChargeToSuki}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-2 rounded-xl transition flex justify-center items-center gap-2 text-sm"
          >
            Charge to Suki
          </button>
          <button
            onClick={onPayCash}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-2 rounded-xl transition flex justify-center items-center gap-2 text-sm shadow-emerald-500/30 shadow-lg"
          >
            Pay Cash <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
