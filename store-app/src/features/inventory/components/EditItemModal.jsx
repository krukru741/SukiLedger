// src/features/inventory/components/EditItemModal.jsx
import React from 'react';
import { X } from 'lucide-react';

export default function EditItemModal({ editingItem, setEditingItem, onSaveEdit }) {
  if (!editingItem) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="bg-emerald-600 px-6 py-5 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Edit Item / Restock</h3>
          <button onClick={() => setEditingItem(null)} className="bg-emerald-500/30 p-1.5 rounded-full hover:bg-emerald-500/50">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSaveEdit} className="p-6 flex flex-col gap-5">
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
  );
}
