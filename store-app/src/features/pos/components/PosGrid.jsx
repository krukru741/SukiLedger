// src/features/pos/components/PosGrid.jsx
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import PosCard from './PosCard';

export default function PosGrid({ inventory, onAddToCart, onOpenAddModal }) {
  const [posSearch, setPosSearch] = useState('');
  
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(posSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <h4 className="font-bold text-slate-800 text-base">Quick POS (Tap to Add)</h4>
        <button className="text-xs font-semibold text-emerald-600 hover:underline">View All</button>
      </div>
      
      {/* POS Search Bar */}
      <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-4 py-2.5">
        <Search size={16} className="text-slate-400 mr-3" />
        <input 
          type="text" 
          placeholder="Search paninda..." 
          value={posSearch}
          onChange={(e) => setPosSearch(e.target.value)}
          className="w-full text-sm text-slate-700 outline-none bg-transparent"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredInventory.map((prod) => (
          <PosCard key={prod.id} product={prod} onAddToCart={onAddToCart} />
        ))}
        <button
          onClick={onOpenAddModal}
          className="bg-emerald-50/50 border border-dashed border-emerald-300 p-2 py-2.5 h-28 rounded-2xl hover:bg-emerald-50 transition active:scale-95 flex flex-col items-center justify-center text-center gap-2 text-emerald-600"
        >
          <div className="p-2 rounded-full bg-emerald-100">
            <Plus size={18} />
          </div>
          <p className="font-bold text-[11px] mt-0.5">Add Item</p>
        </button>
      </div>
    </div>
  );
}
