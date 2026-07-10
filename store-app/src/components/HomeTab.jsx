import React from 'react';
import { Plus, UserPlus, Bell, ShoppingBag, Smartphone, Utensils } from 'lucide-react';

export default function HomeTab() {
  const transactions = [
    { id: 1, name: '2x Coca-Cola 1.5L', time: '10:42 AM', amount: 150.00, icon: ShoppingBag, bg: 'bg-blue-50 text-blue-500' },
    { id: 2, name: '1x Load Globe 50', time: '09:15 AM', amount: 53.00, icon: Smartphone, bg: 'bg-indigo-50 text-indigo-500' },
    { id: 3, name: 'Bread, Eggs, Milk', time: '08:30 AM', amount: 210.00, icon: Utensils, bg: 'bg-amber-50 text-amber-500' },
    { id: 4, name: 'Pancit Canton x4', time: '07:45 AM', amount: 60.00, icon: ShoppingBag, bg: 'bg-orange-50 text-orange-500' }
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* HEADER Banner */}
      <div className="bg-emerald-600 text-white pt-8 pb-12 px-6 rounded-b-[2.5rem] flex justify-between items-center shadow-md">
        <h2 className="text-2xl font-bold tracking-wide">Overview</h2>
        <button className="bg-emerald-500/30 p-2.5 rounded-full hover:bg-emerald-500/50 transition relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full"></span>
        </button>
      </div>

      <div className="px-5 -mt-6 flex-1 flex flex-col gap-6">
        {/* SALES CARD */}
        <div className="bg-white border border-emerald-50/60 p-6 rounded-3xl shadow-sm bg-gradient-to-br from-white to-emerald-50/20 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Today's Sales</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">₱ 1,240.00</h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">+12.5%</span>
              <span className="text-xs text-slate-400">vs yesterday</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-emerald-500 text-white p-5 rounded-3xl shadow-sm hover:bg-emerald-600 transition flex flex-col items-center gap-3 font-semibold text-center">
            <span className="bg-white/20 p-2 rounded-xl"><Plus size={24} /></span>
            New Sale
          </button>
          <button className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:bg-slate-50 transition flex flex-col items-center gap-3 font-semibold text-slate-700 text-center">
            <span className="bg-slate-100 p-2 rounded-xl text-slate-500"><UserPlus size={24} /></span>
            Add Suki
          </button>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex justify-between items-center px-1">
            <h4 className="font-bold text-slate-800 text-base">Recent Transactions</h4>
            <button className="text-xs font-semibold text-emerald-600 hover:underline">See all</button>
          </div>
          <div className="flex flex-col gap-3 bg-white border border-slate-100/80 p-4 rounded-3xl shadow-sm">
            {transactions.map((tx) => {
              const IconComp = tx.icon;
              return (
                <div key={tx.id} className="flex items-center justify-between py-2 last:border-0 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${tx.bg}`}><IconComp size={18} /></div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{tx.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{tx.time}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">₱ {tx.amount.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
