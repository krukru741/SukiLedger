import React, { useState } from 'react';
import { Search, Plus, Minus, Bell, X, Edit2 } from 'lucide-react';

export default function StockTab({ inventory, setInventory }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [editingItem, setEditingItem] = useState(null);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem.name || editingItem.price < 0 || editingItem.min < 0 || editingItem.qty < 0) return;
    
    setInventory(inventory.map(item => 
      item.id === editingItem.id ? {
        ...item,
        name: editingItem.name,
        price: parseFloat(editingItem.price),
        cost: parseFloat(editingItem.cost),
        qty: parseInt(editingItem.qty, 10),
        min: parseInt(editingItem.min, 10)
      } : item
    ));
    setEditingItem(null);
  };

  const updateQty = (id, change) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, qty: Math.max(0, item.qty + change) } : item
    ));
  };

  const lowStockCount = inventory.filter(item => item.qty <= item.min).length;

  const filteredStocks = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'All' || item.qty <= item.min;
    return matchesSearch && matchesFilter;
  });

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

        {/* FILTER PILLS */}
        <div className="flex gap-2">
          <button 
            onClick={() => setFilterType('All')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${filterType === 'All' ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            All Items ({inventory.length})
          </button>
          <button 
            onClick={() => setFilterType('Low Stock')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${filterType === 'Low Stock' ? 'bg-red-500 text-white shadow-md shadow-red-500/30' : 'bg-white border border-slate-200 text-red-500 hover:bg-red-50'}`}
          >
            Low Stock Only ({lowStockCount})
          </button>
        </div>

        {/* INVENTORY LIST */}
        <div className="flex flex-col gap-3.5 mb-6 mt-2">
          {filteredStocks.map((item) => {
            const isLow = item.qty <= item.min;
            return (
              <div 
                key={item.id} 
                className={`p-4 rounded-2xl border transition shadow-sm flex items-center justify-between ${isLow ? 'bg-red-50/40 border-red-100' : 'bg-white border-slate-100'}`}
              >
                <div 
                  className="flex gap-3 items-start flex-1 cursor-pointer group"
                  onClick={() => setEditingItem(item)}
                >
                  <span className={`w-1.5 h-12 rounded-full block ${isLow ? 'bg-red-400' : 'bg-emerald-500'}`}></span>
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-600 transition">{item.name}</h4>
                      <Edit2 size={12} className="text-slate-300 group-hover:text-emerald-500 transition" />
                    </div>
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

      {/* EDIT ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="bg-emerald-600 px-6 py-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Edit Item / Restock</h3>
              <button onClick={() => setEditingItem(null)} className="bg-emerald-500/30 p-1.5 rounded-full hover:bg-emerald-500/50">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cost (Puhunan)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingItem.cost}
                    onChange={e => setEditingItem({ ...editingItem, cost: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Selling Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingItem.price}
                    onChange={e => setEditingItem({ ...editingItem, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Qty</label>
                  <input
                    type="number"
                    required
                    value={editingItem.qty}
                    onChange={e => setEditingItem({ ...editingItem, qty: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Min Alert Limit</label>
                  <input
                    type="number"
                    required
                    value={editingItem.min}
                    onChange={e => setEditingItem({ ...editingItem, min: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition mt-2"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
