// src/features/pos/components/SelectSukiModal.jsx
import React, { useState } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';

export default function SelectSukiModal({ sukiList, cartTotal, onSelectExisting, onAddNewSuki, onClose }) {
  const [isNewSukiToggle, setIsNewSukiToggle] = useState(false);
  const [sukiSearch, setSukiSearch] = useState('');
  const [newSukiName, setNewSukiName] = useState('');
  const [newSukiPhone, setNewSukiPhone] = useState('');

  const filteredSukiList = sukiList.filter(s => s.name.toLowerCase().includes(sukiSearch.toLowerCase()));

  const handleNewSukiSubmit = (e) => {
    e.preventDefault();
    if (!newSukiName.trim()) return;
    onAddNewSuki({ name: newSukiName, phone: newSukiPhone });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 h-[80vh] flex flex-col">
        <div className="bg-emerald-600 px-6 py-5 flex justify-between items-center text-white shrink-0">
          <h3 className="font-bold text-lg">Charge to Suki</h3>
          <button onClick={onClose} className="bg-emerald-500/30 p-1.5 rounded-full hover:bg-emerald-500/50">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 bg-slate-50 shrink-0 border-b border-slate-200 flex flex-col gap-3">
          <div className="flex bg-slate-200/50 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setIsNewSukiToggle(false)}
              className={`flex-1 py-2.5 rounded-xl transition ${!isNewSukiToggle ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Existing Suki
            </button>
            <button
              onClick={() => setIsNewSukiToggle(true)}
              className={`flex-1 py-2.5 rounded-xl transition ${isNewSukiToggle ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              + New Profile
            </button>
          </div>

          {!isNewSukiToggle && (
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text" autoFocus placeholder="Pangitaa si Suki..."
                value={sukiSearch} onChange={e => setSukiSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {isNewSukiToggle ? (
            <form onSubmit={handleNewSukiSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text" required value={newSukiName}
                  onChange={e => setNewSukiName(e.target.value)} placeholder="e.g., Aling Nena"
                  className="w-full bg-white border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number (For SMS)</label>
                <input
                  type="text" value={newSukiPhone}
                  onChange={e => setNewSukiPhone(e.target.value)} placeholder="e.g., 09123456789"
                  className="w-full bg-white border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                />
              </div>
              <div className="pt-4 border-t border-slate-100 mt-2">
                <p className="text-center text-sm font-bold text-slate-500 mb-2">Total Halaga sa Utang</p>
                <p className="text-center text-3xl font-black text-red-500 mb-4">₱{cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <button
                  type="submit" disabled={!newSukiName.trim()}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition text-sm"
                >
                  Save Profile & Confirm Charge
                </button>
              </div>
            </form>
          ) : (
            <>
              {filteredSukiList.length === 0 && (
                <p className="text-center text-slate-400 text-sm mt-4">Suki not found.</p>
              )}
              {filteredSukiList.map(suki => (
                <button
                  key={suki.id}
                  onClick={() => onSelectExisting(suki)}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-300 hover:bg-emerald-50/50 transition active:scale-95 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${suki.bg || 'bg-emerald-100 text-emerald-600'}`}>
                      {suki.initial || suki.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{suki.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Current Balance: ₱{suki.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
