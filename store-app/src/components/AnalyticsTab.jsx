// src/components/AnalyticsTab.jsx
import React, { useMemo } from "react";
import { BarChart2 } from "lucide-react";
import KpiCards from "../features/analytics/components/KpiCards";
import SalesOverviewChart from "../features/analytics/components/SalesOverviewChart";
import TopSellingProducts from "../features/analytics/components/TopSellingProducts";
import SukiDebtRankings from "../features/analytics/components/SukiDebtRankings";
import { buildMonthlyData, buildTopProducts, calculateAggregates } from "../services/analyticsService";

export default function AnalyticsTab({ shiftHistory = [], inventory = [], sukiList = [], todayStats = {} }) {
  const monthlyData = useMemo(() => buildMonthlyData(shiftHistory), [shiftHistory]);
  const topProducts = useMemo(() => buildTopProducts(inventory), [inventory]);
  
  const { totalCash, totalCredit, totalProfit, totalSales, totalDebt } = calculateAggregates({ shiftHistory, todayStats, sukiList });

  const chartData = [...monthlyData, { label: "Today", cash: todayStats.cash || 0, credit: todayStats.credit || 0 }].slice(-7);
  const chartMax = Math.max(...chartData.map(m => m.cash + m.credit), 1);
  const maxSold = Math.max(...topProducts.map(p => p.sold), 1);

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
        <KpiCards 
          totalSales={totalSales} 
          totalProfit={totalProfit} 
          totalDebt={totalDebt} 
          totalCash={totalCash} 
          sukiCount={sukiList.length} 
        />

        <SalesOverviewChart 
          chartData={chartData} 
          chartMax={chartMax} 
          todayStats={todayStats} 
        />

        <TopSellingProducts 
          topProducts={topProducts} 
          maxSold={maxSold} 
        />

        <SukiDebtRankings 
          sukiList={sukiList} 
        />

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
