// src/features/analytics/components/SalesOverviewChart.jsx
import React, { useState } from 'react';

export default function SalesOverviewChart({ chartData, chartMax, todayStats }) {
  const [chartPeriod, setChartPeriod] = useState("history");

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">Sales Overview</h3>
          <p className="text-slate-400 text-[10px] mt-0.5">Cash vs Utang per period</p>
        </div>
        <div className="flex gap-1.5">
          {["history","today"].map(p => (
            <button key={p} onClick={() => setChartPeriod(p)}
              className={"text-[10px] font-bold px-2.5 py-1 rounded-xl transition " + (chartPeriod === p ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500")}
            >{p === "history" ? "History" : "Today"}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"/><span className="text-[10px] text-slate-500 font-medium">Cash</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-amber-400"/><span className="text-[10px] text-slate-500 font-medium">Utang</span></div>
      </div>

      {chartPeriod === "today" ? (
        <div className="flex flex-col gap-3">
          {[
            { label: "Cash Sales", val: todayStats.cash || 0, color: "bg-emerald-500" },
            { label: "Utang Charged", val: todayStats.credit || 0, color: "bg-amber-400" },
            { label: "Net Profit", val: todayStats.profit || 0, color: "bg-blue-500" },
          ].map((row, i) => {
            const mx = Math.max(todayStats.cash, todayStats.credit, todayStats.profit, 1);
            const pct = Math.max((row.val / mx) * 100, 4);
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-600">{row.label}</span>
                  <span className="text-xs font-extrabold text-slate-800">₱{row.val.toLocaleString("en-US",{minimumFractionDigits:2})}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className={row.color + " h-2.5 rounded-full transition-all duration-700"} style={{width: pct + "%"}}/>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        chartData.length === 0
          ? <p className="text-center text-slate-400 text-xs py-8">Wala pay narekord na shift history.</p>
          : <div className="flex items-end justify-between gap-1.5 h-32">
              {chartData.map((m, i) => {
                const total = m.cash + m.credit;
                const cashH = (m.cash / chartMax) * 100;
                const creditH = (m.credit / chartMax) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-[9px] font-bold text-slate-400 text-center">
                      {total >= 1000 ? (total/1000).toFixed(1)+"k" : "₱" + total.toFixed(0)}
                    </p>
                    <div className="w-full flex flex-col justify-end gap-0.5" style={{height:"88px"}}>
                      <div className="w-full bg-amber-400 rounded-t-sm transition-all duration-700" style={{height: Math.max(creditH,0)+"%"}}/>
                      <div className="w-full bg-emerald-500 rounded-t-sm transition-all duration-700" style={{height: Math.max(cashH,0)+"%"}}/>
                    </div>
                    <p className="text-[8px] text-slate-400 text-center leading-tight">{m.label}</p>
                  </div>
                );
              })}
            </div>
      )}
    </div>
  );
}
