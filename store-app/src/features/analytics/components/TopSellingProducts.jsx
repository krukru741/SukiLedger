// src/features/analytics/components/TopSellingProducts.jsx
import React from 'react';
import { Award } from 'lucide-react';

const RANK_COLORS_BG = ["bg-emerald-500","bg-blue-500","bg-amber-500","bg-purple-500","bg-rose-500","bg-cyan-500","bg-orange-500","bg-indigo-500"];
const RANK_BADGE = ["text-amber-500","text-slate-400","text-orange-400","text-slate-300","text-slate-300"];

export default function TopSellingProducts({ topProducts, maxSold }) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
      <h3 className="font-extrabold text-slate-800 text-sm mb-1 flex items-center gap-2"><Award size={16} className="text-amber-500"/>Top Selling Products</h3>
      <p className="text-slate-400 text-[10px] mb-4">Pinaka-paspas mahurot nga paninda</p>
      <div className="flex flex-col gap-3">
        {topProducts.map((p, i) => {
          const pct = Math.max((p.sold / maxSold) * 100, 8);
          return (
            <div key={i} className="flex items-center gap-3">
              <span className={"text-sm font-black w-4 text-center " + RANK_BADGE[i]}>{i+1}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">{p.name}</span>
                  <span className="text-[10px] font-bold text-slate-500">{p.sold} sold</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={RANK_COLORS_BG[i % RANK_COLORS_BG.length] + " h-2 rounded-full transition-all duration-700"} style={{width: pct+"%"}}/>
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-[9px] text-slate-400">₱{p.price.toFixed(2)} / pc</span>
                  <span className="text-[9px] text-emerald-600 font-bold">+₱{p.profit.toFixed(2)} profit</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
