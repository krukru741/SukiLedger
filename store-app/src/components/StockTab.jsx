import React, { useState } from 'react';
import { Search, Plus, Minus, Bell } from 'lucide-react';

export default function StockTab() {
  const [search, setSearch] = useState('');
  const [stocks, setStocks] = useState([
    { id: 1, name: 'Coca-Cola 1.5L', price: 75.00, qty: 12, min: 10 },
    { id: 2, name: 'Pancit Canton', price: 15.00, qty: 3, min: 5 },
    { id: 3, name: 'Bear Brand 150g', price: 55.00, qty: 24, min: 10 },
    { id: 4, name: 'Lucky Me Noodles', price: 12.00, qty: 0, min: 5 }
  ]);

  const updateQty = (id, change) => {
    setStocks(stocks.map(item => 
      item.id === id ? { ...item, qty: Math.max(0, item.qty + change) } : item
    ));
  };

  const filteredStocks = stocks.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50">
      <div className="bg-emerald-600 text-white pt-8 pb-12 px-6 rounded-b-[2.5rem] flex justify-between items-center shadow-md">
        <h2 className="text-2xl font-bold tracking-wide">Inventory</h2>
        <button className="bg-emerald-500/30 p-2.5 rounded-full hover:bg-emerald-500/50"><Bell size={20} /></button>
      </div>

      <div className="px-5 -mt-6 flex-1 flex flex-col gap-4">
        {/* SEARCH BAR */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-4 py-3">
          <Search size={18} className="text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm text-slate-700 outline-none bg-transparent"
          />
        </div>

        {/* INVENTORY LIST */}
        <div className="flex flex-col gap-3.5 mb-6">
          {filteredStocks.map((item) => {
            const isLow = item.qty <= item.min;
            return (
              <div 
                key={item.id} 
                className={`p-4 rounded-2xl border transition shadow-sm flex items-center justify-between ${isLow ? 'bg-red-50/40 border-red-100' : 'bg-white border-slate-100'}`}
              >
                <div className="flex gap-3 items-start">
                  <span className={`w-1.5 h-12 rounded-full block ${isLow ? 'bg-red-400' : 'bg-emerald-500'}`}></span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                    <p className="text-slate-400 text-xs mt-0.5">₱ {item.price.toFixed(2)}</p>
                    <p className={`text-[10px] font-bold mt-2 tracking-wider uppercase ${isLow ? 'text-red-500' : 'text-slate-400'}`}>
                      MIN <span className="ml-0.5">{item.min}</span>
                    </p>
                  </div>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="bg-slate-50 border border-slate-100 rounded-full px-1 py-1 flex items-center gap-4">
                  <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 active:scale-95 transition">
                    <Minus size={14} />
                  </button>
                  <span className={`font-bold text-sm min-w-[20px] text-center ${isLow ? 'text-red-600 font-extrabold' : 'text-slate-800'}`}>
                    {item.qty}
                  </span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 active:scale-95 transition">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
