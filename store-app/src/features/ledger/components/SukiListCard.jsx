// src/features/ledger/components/SukiListCard.jsx
import React from 'react';

export default function SukiListCard({ suki, onClick, overdueDays }) {
  const isClickable = suki.history && suki.history.length > 0;
  
  return (
    <div
      onClick={() => isClickable && onClick(suki)}
      className={`p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between transition active:bg-slate-50 ${isClickable ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base ${suki.bg}`}>
          {suki.initial}
        </div>
        <div>
          <h5 className="font-bold text-slate-800 text-sm">{suki.name}</h5>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-slate-400 text-xs">Last active: {suki.lastActive}</p>
            {overdueDays >= 7 && (
              <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                Overdue {overdueDays}d
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="font-bold text-red-500 text-sm">₱ {suki.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
    </div>
  );
}
