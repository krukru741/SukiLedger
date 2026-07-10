// src/features/analytics/components/SukiDebtRankings.jsx
import React from 'react';
import { Users } from 'lucide-react';

export default function SukiDebtRankings({ sukiList }) {
  const debtors = [...sukiList].filter(s => s.balance > 0).sort((a,b) => b.balance - a.balance).slice(0,5);
  const maxBal = Math.max(...sukiList.map(s => s.balance), 1);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
      <h3 className="font-extrabold text-slate-800 text-sm mb-1 flex items-center gap-2"><Users size={16} className="text-blue-500"/>Suki Debt Rankings</h3>
      <p className="text-slate-400 text-[10px] mb-4">Kinsa ang pinakadako'g utang</p>
      <div className="flex flex-col gap-2.5">
        {debtors.map((sk) => {
          const pct = Math.max((sk.balance / maxBal) * 100, 6);
          return (
            <div key={sk.id} className="flex items-center gap-3">
              <div className={"w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 " + (sk.bg || "bg-slate-100 text-slate-600")}>{sk.initial}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">{sk.name}</span>
                  <span className="text-[10px] font-extrabold text-red-500">₱{sk.balance.toLocaleString("en-US",{minimumFractionDigits:2})}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-red-400 h-1.5 rounded-full transition-all duration-700" style={{width: pct+"%"}}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
