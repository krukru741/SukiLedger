// src/components/StockTab.jsx
import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import StockItemCard from '../features/inventory/components/StockItemCard';
import EditItemModal from '../features/inventory/components/EditItemModal';
import { updateInventoryItem } from '../services/inventoryService';

export default function StockTab({ inventory, setInventory }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [editingItem, setEditingItem] = useState(null);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem.name || editingItem.price < 0 || editingItem.min < 0 || editingItem.qty < 0) return;
    
    updateInventoryItem({
      id: editingItem.id,
      updates: {
        name: editingItem.name,
        price: parseFloat(editingItem.price),
        cost: parseFloat(editingItem.cost),
        qty: parseInt(editingItem.qty, 10),
        min: parseInt(editingItem.min, 10)
      },
      setInventory
    });
    
    setEditingItem(null);
  };

  const updateQty = (id, change) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    updateInventoryItem({
      id,
      updates: { qty: Math.max(0, item.qty + change) },
      setInventory
    });
  };

  const lowStockCount = inventory.filter(item => item.qty <= item.min).length;
  const totalAssetValue = inventory.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const filteredStocks = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'All' || item.qty <= item.min;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50">
      <div className="bg-emerald-600 text-white pt-8 pb-14 px-6 rounded-b-[2.5rem] flex flex-col gap-2 shadow-md">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-2xl font-bold tracking-wide">Inventory</h2>
          <button className="bg-emerald-500/30 p-2.5 rounded-full hover:bg-emerald-500/50"><Bell size={20} /></button>
        </div>
        <div className="mt-1 flex flex-col">
          <span className="text-emerald-100 text-[10px] font-bold tracking-wider uppercase">Total Asset Value</span>
          <span className="text-2xl font-black tracking-tight mt-0.5">₱{totalAssetValue.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
        </div>
      </div>

      <div className="px-5 -mt-8 flex-1 flex flex-col gap-4">
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
        <div className="flex flex-col gap-3.5 mb-6 mt-2 stagger-children">
          {filteredStocks.map((item) => (
            <StockItemCard 
              key={item.id} 
              item={item} 
              onEdit={setEditingItem} 
              onUpdateQty={updateQty} 
            />
          ))}
        </div>
      </div>

      {/* EDIT ITEM MODAL */}
      <EditItemModal 
        editingItem={editingItem} 
        setEditingItem={setEditingItem} 
        onSaveEdit={handleSaveEdit} 
      />
    </div>
  );
}
