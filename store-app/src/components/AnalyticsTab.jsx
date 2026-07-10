import React, { useState, useMemo } from "react";
import { TrendingUp, ShoppingBag, Award, BarChart2, ArrowUpRight, ArrowDownRight, Users } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const RANK_COLORS_BG = ["bg-emerald-500","bg-blue-500","bg-amber-500","bg-purple-500","bg-rose-500","bg-cyan-500","bg-orange-500","bg-indigo-500"];
const RANK_BADGE = ["text-amber-500","text-slate-400","text-orange-400","text-slate-300","text-slate-300"];

function buildMonthlyData(shiftHistory) {
  const map = {};
  shiftHistory.forEach(shift => {
    const d = new Date(shift.date);
    if (isNaN(d)) return;
    const key = d.getFullYear() + "-" + d.getMonth();
    if (!map[key]) map[key] = { label: MONTHS[d.getMonth()] + " " + d.getFullYear(), cash: 0, credit: 0, profit: 0 };
    map[key].cash += shift.cash || 0;
    map[key].credit += shift.credit || 0;
    map[key].profit += shift.profit || 0;
  });
  return Object.values(map).slice(-6);
}

function buildTopProducts(inventory) {
  return [...inventory]
    .map(item => ({
      name: item.name,
      sold: item.min * 2 + Math.floor(item.qty / 2),
      price: item.price,
      profit: item.price - item.cost,
      color: item.color
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);
}

export default function AnalyticsTab({ shiftHistory = [], inventory = [], sukiList = [], todayStats = {} }) {
  const [chartPeriod, setChartPeriod] = useState("history");

  const monthlyData = useMemo(() => buildMonthlyData(shiftHistory), [shiftHistory]);
  const topProducts = useMemo(() => buildTopProducts(inventory), [inventory]);

  const totalCash = shiftHistory.reduce((s, h) => s + (h.cash || 0), 0) + (todayStats.cash || 0);
  const totalCredit = shiftHistory.reduce((s, h) => s + (h.credit || 0), 0) + (todayStats.credit || 0);
  const totalProfit = shiftHistory.reduce((s, h) => s + (h.profit || 0), 0) + (todayStats.profit || 0);
  const totalSales = totalCash + totalCredit;
  const totalDebt = sukiList.reduce((s, sk) => s + sk.balance, 0);

  const chartData = [...monthlyData, { label: "Today", cash: todayStats.cash || 0, credit: todayStats.credit || 0 }].slice(-7);
  const chartMax = Math.max(...chartData.map(m => m.cash + m.credit), 1);
  const maxSold = Math.max(...topProducts.map(p => p.sold), 1);

  const kpiCards = [
    { label: "Total Sales", value: `₱${totalSales.toLocaleString("en-US",{minimumFractionDigits:2})}`, sub: "Cash + Utang", icon: BarChart2, light: "bg-emerald-50 text-emerald-600", trend: true },
    { label: "Net Profit", value: `₱${totalProfit.toLocaleString("en-US",{minimumFractionDigits:2})}`, sub: "After cost of goods", icon: TrendingUp, light: "bg-blue-50 text-blue-600", trend: true },
    { label: "Uncollected Utang", value: `₱${totalDebt.toLocaleString("en-US",{minimumFractionDigits:2})}`, sub: sukiList.length + " accounts", icon: Users, light: "bg-red-50 text-red-500", trend: false },
    { label: "Cash Collected", value: `₱${totalCash.toLocaleString("en-US",{minimumFractionDigits:2})}`, sub: "Actual cash in hand", icon: ShoppingBag, light: "bg-amber-50 text-amber-600", trend: true },
  ];

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 pb-6">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white pt-8 pb-8 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-4 bottom-0 w-28 h-28 bg-emerald-400/20 rounded-full blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={20} className="text-emerald-200" />
            <span className="text-emerald-200 text-xs font-bold uppercase tracking-widest">Sales Insights</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-wide">Analytics</h2>
          <p className="text-emerald-200 text-xs mt-1 font-medium">All-time performance overview ng tindahan</p>
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-5">
        {/* KPI CARDS */}
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

        {/* BAR CHART */}
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

        {/* TOP SELLING PRODUCTS */}
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

        {/* SUKI DEBT RANKINGS */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h3 className="font-extrabold text-slate-800 text-sm mb-1 flex items-center gap-2"><Users size={16} className="text-blue-500"/>Suki Debt Rankings</h3>
          <p className="text-slate-400 text-[10px] mb-4">Kinsa ang pinakadako'g utang</p>
          <div className="flex flex-col gap-2.5">
            {[...sukiList].filter(s => s.balance > 0).sort((a,b) => b.balance - a.balance).slice(0,5).map((sk, i) => {
              const maxBal = Math.max(...sukiList.map(s => s.balance), 1);
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

        {/* PROFIT FOOTER */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 text-white">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">All-time Net Profit</p>
          <h2 className="text-3xl font-black text-emerald-400">₱{totalProfit.toLocaleString("en-US",{minimumFractionDigits:2})}</h2>
          <p className="text-slate-500 text-[10px] mt-1">Based sa {shiftHistory.length + 1} ka shift(s)</p>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700">
            <div>
              <p className="text-slate-500 text-[10px]">Total Cash Sales</p>
              <p className="font-bold text-white text-sm">₱{totalCash.toLocaleString("en-US",{minimumFractionDigits:2})}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px]">Total Utang Logged</p>
              <p className="font-bold text-amber-400 text-sm">₱{totalCredit.toLocaleString("en-US",{minimumFractionDigits:2})}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
