import React, { useState } from 'react';
import { Bell, Filter, X, Send, CreditCard } from 'lucide-react';

export default function LedgerTab({ sukiList, setSukiList }) {
  const [selectedSuki, setSelectedSuki] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  const totalDebt = sukiList.reduce((sum, suki) => sum + suki.balance, 0);

  const sendSMSReminder = (suki) => {
    const msg = `Hi ${suki.name}, maayong adlaw! Pahinumdom lang gikan sa tindahan sa imong kasamtangang balance nga ₱${suki.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}. Daghang salamat!`;
    if (suki.phone) {
      const smsLink = `sms:${suki.phone}?body=${encodeURIComponent(msg)}`;
      window.open(smsLink, '_self');
    } else {
      navigator.clipboard.writeText(msg);
      alert(`Reminder text copied to clipboard for ${suki.name}! Wala pay phone number nga na-save.`);
    }
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) return;

    setSukiList(sukiList.map(s => {
      if (s.id === selectedSuki.id) {
        const newBalance = s.balance - amt;
        const newHistory = [
          { 
            desc: `Payment Received — ₱${amt.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 
            date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }), 
            amt: -amt,
            isPayment: true
          },
          ...s.history
        ];
        const updatedSuki = { ...s, balance: newBalance, history: newHistory };
        setSelectedSuki(updatedSuki);
        return updatedSuki;
      }
      return s;
    }));

    setPaymentAmount('');
    setIsPaymentModalOpen(false);
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
            <h3 className="text-3xl font-black mt-1">₱ {totalDebt.toLocaleString('en-US', {minimumFractionDigits: 2})}</h3>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl transition text-center text-sm shadow-md active:scale-98">
            Record New Payment
          </button>
        </div>

        {/* LIST TITLE SECTION */}
        <div className="flex justify-between items-center mt-2 px-1">
          <h4 className="font-extrabold text-slate-800 text-base">Suki Accounts</h4>
          <button className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition"><Filter size={16} /></button>
        </div>

        {/* SUKI ACCOUNTS LIST */}
        <div className="flex flex-col gap-3 mb-6">
          {sukiList.map((suki) => (
            <div 
              key={suki.id} 
              onClick={() => suki.history.length > 0 && setSelectedSuki(suki)}
              className={`p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between transition active:bg-slate-50 ${suki.history.length > 0 ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base ${suki.bg}`}>{suki.initial}</div>
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">{suki.name}</h5>
                  <p className="text-slate-400 text-xs mt-0.5">Last active: {suki.lastActive}</p>
                </div>
              </div>
              <p className="font-bold text-red-500 text-sm">₱ {suki.balance.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED LEDGER DIALOG MODAL (SCREEN 4) */}
      {selectedSuki && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center animate-fade-in md:p-4 md:items-center">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-3xl p-6 shadow-2xl flex flex-col gap-6 animate-slide-up max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3.5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${selectedSuki.bg}`}>{selectedSuki.initial}</div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">{selectedSuki.name}</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">Total Utang: <span className="text-red-500 font-bold">₱ {selectedSuki.balance.toLocaleString()}.00</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedSuki(null)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>

            {/* Debt Log Section */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Debt History</p>
              <div className="flex flex-col gap-3">
                {selectedSuki.history.map((log, index) => (
                  <div key={index} className={`bg-slate-50/70 border ${log.isPayment ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100'} p-4 rounded-2xl flex justify-between items-center`}>
                    <div>
                      <p className={`font-bold text-sm ${log.isPayment ? 'text-emerald-600' : 'text-slate-700'}`}>{log.desc}</p>
                      <p className="text-slate-400 text-[11px] mt-1">{log.date}</p>
                    </div>
                    <p className={`font-bold text-sm ${log.isPayment ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {log.isPayment ? '- ₱ ' : '₱ '}{Math.abs(log.amt).toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 mt-2">
              <button 
                onClick={() => sendSMSReminder(selectedSuki)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm transition active:scale-98"
              >
                <Send size={16} /> Send Reminder
              </button>
              <button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition active:scale-98"
              >
                <CreditCard size={16} /> Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-xs overflow-hidden shadow-2xl">
            <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold">Record Payment</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="bg-emerald-500/30 p-1 rounded-full hover:bg-emerald-500/50">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-5 flex flex-col gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Current Balance:</p>
                <p className="text-lg font-bold text-red-500 mb-4">₱ {selectedSuki?.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Amount Paid (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  autoFocus
                  required
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-bold text-lg text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                />
              </div>
              <button
                type="submit"
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                className={`w-full font-bold py-3 rounded-xl transition ${
                  paymentAmount && parseFloat(paymentAmount) > 0
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Save Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
