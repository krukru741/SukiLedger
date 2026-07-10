// src/components/LedgerTab.jsx
import React, { useState } from 'react';
import { Bell, Filter } from 'lucide-react';
import SukiListCard from '../features/ledger/components/SukiListCard';
import DetailedLedgerModal from '../features/ledger/components/DetailedLedgerModal';
import RecordPaymentModal from '../features/ledger/components/RecordPaymentModal';
import RecordNewLedgerModal from '../features/ledger/components/RecordNewLedgerModal';
import { recordSukiPayment, recordManualLedger } from '../services/sukiService';

export default function LedgerTab({ settings, sukiList, setSukiList }) {
  const [selectedSuki, setSelectedSuki] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortType, setSortType] = useState('recent');
  const [isRecordLedgerModalOpen, setIsRecordLedgerModalOpen] = useState(false);

  const totalDebt = sukiList.reduce((sum, suki) => sum + suki.balance, 0);

  const getLatestDate = (suki) => {
    if (!suki.history || suki.history.length === 0) return 0;
    return new Date(suki.history[0].date).getTime();
  };

  const sortedSukiList = [...sukiList].sort((a, b) => {
    if (sortType === 'name') return a.name.localeCompare(b.name);
    if (sortType === 'debt') return b.balance - a.balance;
    return getLatestDate(b) - getLatestDate(a);
  });

  const sendSMSReminder = (suki) => {
    const template = settings?.smsTemplate || 'Maayong adlaw, {name}! Reminder lang gikan sa {storeName} bahin sa imong kasamtangang utang ledger nga nagkantidad og {balance}. Pwede ra nimo ma-settle sa tindahan kung hayahay na ka. Salamat kaayo!';
    const reminderMessage = template
      .replaceAll('{name}', suki.name)
      .replaceAll('{balance}', `₱${suki.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
      .replaceAll('{storeName}', settings?.storeName || 'ang tindahan');
    if (suki.phone) {
      window.location.href = `sms:${suki.phone}?body=${encodeURIComponent(reminderMessage)}`;
    } else {
      navigator.clipboard.writeText(reminderMessage);
      alert(`Reminder text copied to clipboard for ${suki.name}! Wala pay phone number nga na-save.`);
    }
  };

  const getOverdueDays = (suki) => {
    if (suki.balance <= 0 || !suki.history || suki.history.length === 0) return 0;
    const oldestTx = suki.history[suki.history.length - 1];
    const diffTime = new Date() - new Date(oldestTx.date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleRecordPayment = (amount) => {
    recordSukiPayment({ sukiId: selectedSuki.id, amount, setSukiList });
    
    // Update local selectedSuki for the modal to reflect immediately
    setSelectedSuki(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      history: [
        {
          desc: `Payment Received — ₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          amt: -amount,
          isPayment: true
        },
        ...prev.history
      ]
    }));
    
    setIsPaymentModalOpen(false);
  };

  const handleSaveNewLedger = (data) => {
    const updatedSuki = recordManualLedger({ ...data, sukiList, setSukiList });
    setIsRecordLedgerModalOpen(false);

    if (updatedSuki) {
      setTimeout(() => {
        sendSMSReminder(updatedSuki);
      }, 300);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 relative">
      <div className="bg-emerald-600 text-white pt-8 pb-12 px-6 rounded-b-[2.5rem] flex justify-between items-center shadow-md">
        <h2 className="text-2xl font-bold tracking-wide">Suki Ledger</h2>
        <button className="bg-emerald-500/30 p-2.5 rounded-full hover:bg-emerald-500/50"><Bell size={20} /></button>
      </div>

      <div className="px-5 -mt-6 flex-1 flex flex-col gap-5">
        {/* LEDGER DISPLAY CARD */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col gap-4">
          <div>
            <p className="text-slate-400 text-xs font-medium tracking-wide">Total Utang to Collect</p>
            <h3 className="text-3xl font-black mt-1">₱ {totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
          <button 
            onClick={() => setIsRecordLedgerModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl transition text-center text-sm shadow-md active:scale-98"
          >
            Record New Ledger
          </button>
        </div>

        {/* LIST TITLE SECTION */}
        <div className="flex justify-between items-center mt-2 px-1">
          <h4 className="font-extrabold text-slate-800 text-base">Suki Accounts</h4>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition"
            >
              <Filter size={16} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => { setSortType('recent'); setIsFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition font-medium ${sortType === 'recent' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Most Recent Active
                </button>
                <button
                  onClick={() => { setSortType('debt'); setIsFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition font-medium ${sortType === 'debt' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Highest Debt First
                </button>
                <button
                  onClick={() => { setSortType('name'); setIsFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition font-medium ${sortType === 'name' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Name (A-Z)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SUKI ACCOUNTS LIST */}
        <div className="flex flex-col gap-3 mb-6">
          {sortedSukiList.map((suki) => (
            <SukiListCard 
              key={suki.id} 
              suki={suki} 
              onClick={setSelectedSuki} 
              overdueDays={getOverdueDays(suki)} 
            />
          ))}
        </div>
      </div>

      {/* MODALS */}
      <DetailedLedgerModal 
        selectedSuki={selectedSuki} 
        onClose={() => setSelectedSuki(null)} 
        onSendReminder={sendSMSReminder} 
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)} 
      />

      {isPaymentModalOpen && (
        <RecordPaymentModal 
          selectedSuki={selectedSuki} 
          onClose={() => setIsPaymentModalOpen(false)} 
          onSave={handleRecordPayment} 
        />
      )}

      {isRecordLedgerModalOpen && (
        <RecordNewLedgerModal 
          sukiList={sukiList} 
          onClose={() => setIsRecordLedgerModalOpen(false)} 
          onSave={handleSaveNewLedger} 
        />
      )}
    </div>
  );
}
