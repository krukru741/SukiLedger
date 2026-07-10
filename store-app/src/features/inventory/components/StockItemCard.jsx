// src/features/inventory/components/StockItemCard.jsx
import React from 'react';
import { Plus, Minus, Edit2 } from 'lucide-react';

export default function StockItemCard({ item, onEdit, onUpdateQty }) {
  const isLow = item.qty <= item.min;

  return (
    <div className={`p-4 rounded-2xl border transition shadow-sm flex items-center justify-between ${isLow ? 'bg-red-50/40 border-red-100' : 'bg-white border-slate-100'}`}>
      <div 
        className="flex gap-3 items-start flex-1 cursor-pointer group"
        onClick={() => onEdit(item)}
      >
        <span className={`w-1.5 h-12 rounded-full block ${isLow ? 'bg-red-400' : 'bg-emerald-500'}`}></span>
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-600 transition">{item.name}</h4>
            <Edit2 size={12} className="text-slate-300 group-hover:text-emerald-500 transition" />
          </div>
          <p className="text-slate-700 font-semibold text-xs mt-0.5">Sell: ₱{item.price.toFixed(2)}</p>
          <p className="text-slate-400 text-[9px] mt-0.5 tracking-wide">
            Cost: ₱{item.cost.toFixed(2)} <span className="mx-1 opacity-50">|</span> 
            Profit: <span className="text-emerald-600 font-semibold">₱{(item.price - item.cost).toFixed(2)}</span>
          </p>
          <p className={`text-[9px] font-bold mt-2 tracking-wider uppercase ${isLow ? 'text-red-500' : 'text-slate-400'}`}>
            MIN <span className="ml-0.5">{item.min}</span>
          </p>
        </div>
      </div>

      {/* QUANTITY CONTROLS */}
      <div className="bg-slate-50 border border-slate-100 rounded-full px-1 py-1 flex items-center gap-4">
        <button onClick={() => onUpdateQty(item.id, -1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 active:scale-95 transition">
          <Minus size={14} />
        </button>
        <span className={`font-bold text-sm min-w-[20px] text-center ${isLow ? 'text-red-600 font-extrabold' : 'text-slate-800'}`}>
          {item.qty}
        </span>
        <button onClick={() => onUpdateQty(item.id, 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 active:scale-95 transition">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
