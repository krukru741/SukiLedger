// src/features/pos/components/PosCard.jsx
import React from 'react';

export default function PosCard({ product, onAddToCart }) {
  const IconComp = product.icon;
  return (
    <button
      onClick={() => onAddToCart(product)}
      className="bg-white border border-slate-100 p-2 py-2.5 h-28 rounded-2xl shadow-sm hover:border-emerald-200 hover:shadow-md transition active:scale-95 flex flex-col items-center justify-between text-center relative overflow-hidden group"
    >
      <div className={`p-2 rounded-xl ${product.color} group-hover:scale-110 transition-transform`}>
        <IconComp size={18} />
      </div>
      <div className="flex flex-col items-center w-full px-1">
        <p className="font-semibold text-slate-700 text-[11px] leading-tight line-clamp-2 w-full">{product.name}</p>
        <p className="font-bold text-slate-800 text-[11px] mt-0.5">₱{product.price}</p>
      </div>
    </button>
  );
}
