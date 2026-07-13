// src/features/pos/components/AddItemModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ITEM_CATEGORIES, addInventoryItem } from '../../../services/inventoryService';

export default function AddItemModal({ inventory, setInventory, onClose }) {
  const [newItem, setNewItem] = useState({ name: '', cost: '', price: '', stock: '', categoryIndex: 0 });

  const isValid = newItem.name.trim() !== '' && parseFloat(newItem.price) > 0 && newItem.cost !== '' && newItem.stock !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    addInventoryItem({ newItem, inventory, setInventory });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm modal-backdrop">
      <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in">
        <div className="bg-emerald-600 px-6 py-5 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Add New POS Item</h3>
          <button onClick={onClose} className="bg-emerald-500/30 p-1.5 rounded-full hover:bg-emerald-500/50">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category Icon</label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {ITEM_CATEGORIES.map((cat, idx) => {
                const IconComp = cat.icon;
                const isSelected = newItem.categoryIndex === idx;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setNewItem({ ...newItem, categoryIndex: idx })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition min-w-[4rem] border-2 ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
                  >
                    <div className={`p-2 rounded-xl ${cat.color}`}><IconComp size={20} /></div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`}>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
            <input
              type="text" autoFocus required placeholder="e.g. Kopiko Blanca"
              value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cost Price (Puhunan)</label>
              <input
                type="number" step="0.01" required placeholder="0.00"
                value={newItem.cost} onChange={e => setNewItem({ ...newItem, cost: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Selling Price (Baligya)</label>
              <input
                type="number" step="0.01" required placeholder="0.00"
                value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Initial Stock (Pila ka Buok)</label>
            <input
              type="number" required placeholder="e.g. 24"
              value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
            />
          </div>

          <button
            type="submit" disabled={!isValid}
            className={`w-full font-bold py-3.5 rounded-xl transition mt-2 ${isValid ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            Save Item
          </button>
        </form>
      </div>
    </div>
  );
}
