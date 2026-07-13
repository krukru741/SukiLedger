// src/features/ledger/components/RecordNewLedgerModal.jsx
import React, { useState } from 'react';

export default function RecordNewLedgerModal({ sukiList = [], onClose, onSave }) {
  const [isNewSuki, setIsNewSuki] = useState(false);
  const [selectedSukiId, setSelectedSukiId] = useState('');
  const [newSukiName, setNewSukiName] = useState('');
  const [newSukiPhone, setNewSukiPhone] = useState('');
  const [itemsUtang, setItemsUtang] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm modal-backdrop">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl animate-scale-in">
        <h3 className="text-xl font-black text-slate-800 mb-4">Record New Ledger</h3>
        
        {/* TOGGLE: OLD VS NEW SUKI */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 text-xs font-bold">
          <button 
            type="button"
            onClick={() => setIsNewSuki(false)}
            className={`flex-1 py-2 rounded-xl transition ${!isNewSuki ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            Existing Suki
          </button>
          <button 
            type="button"
            onClick={() => setIsNewSuki(true)}
            className={`flex-1 py-2 rounded-xl transition ${isNewSuki ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            + New Suki Profile
          </button>
        </div>

        {/* CUSTOMER SELECTOR OR INPUT */}
        {!isNewSuki ? (
          <div className="mb-4">
            <label className="text-slate-400 font-bold text-[10px] tracking-wider uppercase block mb-1.5">Pili og Suki</label>
            <select 
              value={selectedSukiId} 
              onChange={(e) => setSelectedSukiId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 text-sm focus:outline-none"
            >
              <option value="">-- Select Customer --</option>
              {sukiList.map(suki => (
                <option key={suki.id} value={suki.id}>{suki.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-slate-400 font-bold text-[10px] tracking-wider uppercase block mb-1">Full Name</label>
              <input 
                type="text" 
                value={newSukiName} 
                onChange={(e) => setNewSukiName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none" 
                placeholder="e.g., Aling Nena" 
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold text-[10px] tracking-wider uppercase block mb-1">Phone Number (For SMS)</label>
              <input 
                type="text" 
                value={newSukiPhone} 
                onChange={(e) => setNewSukiPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none" 
                placeholder="e.g., 09123456789" 
              />
            </div>
          </div>
        )}

        {/* UTANG DETAILS */}
        <div className="mb-4">
          <label className="text-slate-400 font-bold text-[10px] tracking-wider uppercase block mb-1.5">Mga Gipalit (Items)</label>
          <textarea 
            value={itemsUtang}
            onChange={(e) => setItemsUtang(e.target.value)}
            rows="2"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none resize-none"
            placeholder="e.g., 5kg Rice, 1L Oil"
          />
        </div>

        {/* TOTAL AMOUNT DUE */}
        <div className="mb-6">
          <label className="text-slate-400 font-bold text-[10px] tracking-wider uppercase block mb-1.5">Total Halaga (₱)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₱</span>
            <input 
              type="number" 
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-extrabold text-slate-800 text-lg focus:outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 py-3.5 bg-slate-100 font-bold text-slate-600 rounded-2xl text-xs">
            Cancel
          </button>
          <button 
            type="button"
            disabled={(!selectedSukiId && !newSukiName) || !itemsUtang || !totalAmount}
            onClick={() => onSave({ isNewSuki, selectedSukiId, newSukiName, newSukiPhone, itemsUtang, totalAmount: Number(totalAmount) })}
            className="flex-1 py-3.5 bg-emerald-500 font-bold text-white rounded-2xl text-xs hover:bg-emerald-600 disabled:opacity-40 transition shadow-md"
          >
            Save Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
