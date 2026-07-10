import React, { useState } from 'react';
import HomeTab from './components/HomeTab';
import StockTab from './components/StockTab';
import LedgerTab from './components/LedgerTab';
import { LayoutGrid, Package, BookOpen, Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pb-20 md:pb-0">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-5 sticky top-0 h-screen">
        <h1 className="text-xl font-bold text-emerald-600 mb-8">SukiLedger</h1>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'home' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutGrid size={20} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('stock')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'stock' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Package size={20} /> Inventory
          </button>
          <button 
            onClick={() => setActiveTab('ledger')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'ledger' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BookOpen size={20} /> Suki Ledger
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-md mx-auto w-full bg-white md:max-w-4xl md:my-6 md:rounded-2xl md:shadow-sm overflow-hidden flex flex-col">
        {/* Render rendering active screen */}
        <div className="flex-1">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'stock' && <StockTab />}
          {activeTab === 'ledger' && <LedgerTab />}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-6 py-2 flex justify-around items-center md:hidden z-50">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
          <LayoutGrid size={22} />
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => setActiveTab('stock')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'stock' ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
          <Package size={22} />
          <span className="text-xs">Stock</span>
        </button>
        <button onClick={() => setActiveTab('ledger')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'ledger' ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
          <BookOpen size={22} />
          <span className="text-xs">Ledger</span>
        </button>
      </div>
    </div>
  );
}
