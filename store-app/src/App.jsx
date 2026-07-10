import React, { useState } from 'react';
import HomeTab from './components/HomeTab';
import StockTab from './components/StockTab';
import LedgerTab from './components/LedgerTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsTab from './components/SettingsTab';
import { LayoutGrid, Package, BookOpen, BarChart2, Settings, Loader2 } from 'lucide-react';
import { INITIAL_STATS, INITIAL_SETTINGS } from './constants/mockData';
import { useSupabaseData } from './hooks/useSupabaseData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sukiList, setSukiList] = useState([]);
  const [todayStats, setTodayStats] = useState(INITIAL_STATS);
  const [shiftHistory, setShiftHistory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  const { loading } = useSupabaseData(setInventory, setSukiList, setShiftHistory);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <Loader2 size={40} className="text-emerald-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading SukiLedger...</p>
      </div>
    );
  }

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
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'analytics' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BarChart2 size={20} /> Analytics
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === 'settings' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-md mx-auto w-full bg-white md:max-w-4xl md:my-6 md:rounded-2xl md:shadow-sm overflow-hidden flex flex-col">
        {/* Render rendering active screen */}
        <div className="flex-1">
          {activeTab === 'home' && <HomeTab sukiList={sukiList} setSukiList={setSukiList} todayStats={todayStats} setTodayStats={setTodayStats} shiftHistory={shiftHistory} setShiftHistory={setShiftHistory} inventory={inventory} setInventory={setInventory} />}
          {activeTab === 'stock' && <StockTab inventory={inventory} setInventory={setInventory} />}
          {activeTab === 'ledger' && <LedgerTab sukiList={sukiList} setSukiList={setSukiList} />}
          {activeTab === 'analytics' && <AnalyticsTab shiftHistory={shiftHistory} inventory={inventory} sukiList={sukiList} todayStats={todayStats} />}
          {activeTab === 'settings' && <SettingsTab settings={settings} setSettings={setSettings} />}
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
        <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'analytics' ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
          <BarChart2 size={22} />
          <span className="text-xs">Analytics</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'settings' ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
          <Settings size={22} />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  );
}
