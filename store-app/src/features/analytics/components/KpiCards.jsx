// src/features/analytics/components/KpiCards.jsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, ShoppingBag, BarChart2 } from 'lucide-react';

export default function KpiCards({ totalSales, totalProfit, totalDebt, totalCash, sukiCount }) {
  const kpiCards = [
    { label: "Total Sales", value: `₱${totalSales.toLocaleString("en-US",{minimumFractionDigits:2})}`, sub: "Cash + Utang", icon: BarChart2, light: "bg-emerald-50 text-emerald-600", trend: true },
    { label: "Net Profit", value: `₱${totalProfit.toLocaleString("en-US",{minimumFractionDigits:2})}`, sub: "After cost of goods", icon: TrendingUp, light: "bg-blue-50 text-blue-600", trend: true },
    { label: "Uncollected Utang", value: `₱${totalDebt.toLocaleString("en-US",{minimumFractionDigits:2})}`, sub: sukiCount + " accounts", icon: Users, light: "bg-red-50 text-red-500", trend: false },
    { label: "Cash Collected", value: `₱${totalCash.toLocaleString("en-US",{minimumFractionDigits:2})}`, sub: "Actual cash in hand", icon: ShoppingBag, light: "bg-amber-50 text-amber-600", trend: true },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {kpiCards.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className={"p-2 rounded-xl " + kpi.light}><Icon size={16} /></div>
              {kpi.trend
                ? <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-lg flex items-center gap-0.5"><ArrowUpRight size={10}/>+</span>
                : <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-lg flex items-center gap-0.5"><ArrowDownRight size={10}/>Utang</span>
              }
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5 leading-tight">{kpi.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{kpi.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
