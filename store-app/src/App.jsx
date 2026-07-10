import React, { useState } from 'react';
import HomeTab from './components/HomeTab';
import StockTab from './components/StockTab';
import LedgerTab from './components/LedgerTab';
import AnalyticsTab from './components/AnalyticsTab';
import { LayoutGrid, Package, BookOpen, Bell, Utensils, Coffee, ShoppingBag, Droplet, BarChart2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sukiList, setSukiList] = useState([
    { id: 1, name: 'Aling Nena', balance: 1200, phone: '09123456789', lastActive: '2 days ago', initial: 'A', bg: 'bg-emerald-100 text-emerald-700',
      history: [
        { desc: '5kg Rice, 1L Oil', date: 'Oct 24, 2023, 09:15 AM', amt: 450 },
        { desc: 'Canned Goods, Bread', date: 'Oct 22, 2023, 02:30 PM', amt: 350 },
        { desc: 'Detergent, Load', date: 'Oct 18, 2023, 06:45 AM', amt: 400 }
      ]
    },
    { id: 2, name: 'Mang Juan', balance: 850, phone: '09876543210', lastActive: 'Yesterday', initial: 'M', bg: 'bg-amber-100 text-amber-700', history: [] },
    { id: 3, name: 'Kuya Pedro', balance: 1400, phone: '09112223333', lastActive: 'Today', initial: 'K', bg: 'bg-blue-100 text-blue-700', history: [] },
    { id: 4, name: 'Ate Susan', balance: 450, phone: '09998887777', lastActive: '1 week ago', initial: 'A', bg: 'bg-purple-100 text-purple-700', history: [] }
  ]);

  const [todayStats, setTodayStats] = useState({
    cash: 840.00,
    credit: 400.00,
    profit: 248.00,
    startingCash: 500.00
  });

  const [shiftHistory, setShiftHistory] = useState([
    { 
      id: 1, date: 'Oct 24, 2023', cash: 1200, credit: 350, profit: 320, startingCash: 500,
      transactions: [
        { id: 't1', desc: '10x Pancit Canton, 2x Coca-Cola 1.5L', total: 300, type: 'Cash' },
        { id: 't2', desc: '3x Marlboro Red', total: 300, type: 'Utang - Mang Juan' },
        { id: 't3', desc: 'Rice 5kg, Canned Goods', total: 950, type: 'Cash' }
      ]
    },
    { 
      id: 2, date: 'Oct 23, 2023', cash: 950, credit: 200, profit: 210, startingCash: 500,
      transactions: [
        { id: 't4', desc: 'Bear Brand 150g, Bread', total: 110, type: 'Cash' },
        { id: 't5', desc: '2x Kopiko Brown, Sugar', total: 44, type: 'Utang - Aling Nena' },
        { id: 't6', desc: 'Assorted Groceries', total: 840, type: 'Cash' },
        { id: 't7', desc: 'Pancit Canton x10', total: 156, type: 'Utang - Mang Juan' }
      ]
    }
  ]);

  // Unified Global Inventory State
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Coca-Cola 1.5L', price: 75.00, cost: 65.00, qty: 12, min: 10, icon: Utensils, color: 'bg-red-50 text-red-500' },
    { id: 2, name: 'Pancit Canton', price: 15.00, cost: 12.00, qty: 3, min: 5, icon: Package, color: 'bg-orange-50 text-orange-500' },
    { id: 3, name: 'Marlboro Red', price: 100.00, cost: 90.00, qty: 8, min: 10, icon: Package, color: 'bg-red-50 text-red-700' },
    { id: 4, name: 'Great Taste White', price: 12.00, cost: 9.00, qty: 20, min: 15, icon: Coffee, color: 'bg-orange-50 text-orange-600' },
    { id: 5, name: 'Bear Brand 150g', price: 55.00, cost: 48.00, qty: 24, min: 10, icon: Coffee, color: 'bg-yellow-50 text-yellow-600' },
    { id: 6, name: 'Kopiko Brown', price: 12.00, cost: 9.00, qty: 45, min: 20, icon: Coffee, color: 'bg-amber-50 text-amber-700' },
    { id: 7, name: 'Repacked Sugar', price: 20.00, cost: 15.00, qty: 15, min: 10, icon: ShoppingBag, color: 'bg-slate-100 text-slate-500' },
    { id: 8, name: 'Ice Tubig', price: 3.00, cost: 1.00, qty: 100, min: 50, icon: Droplet, color: 'bg-cyan-50 text-cyan-500' },
  ]);

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
      </div>
    </div>
  );
}
