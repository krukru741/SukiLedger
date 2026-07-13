// src/components/HomeTab.jsx (Thin Container)
import React, { useState, useEffect } from 'react';
import { Bell, Package, X } from 'lucide-react';
import { useCart } from '../features/pos/hooks/useCart';
import PosGrid from '../features/pos/components/PosGrid';
import CartPanel from '../features/pos/components/CartPanel';
import AddItemModal from '../features/pos/components/AddItemModal';
import SelectSukiModal from '../features/pos/components/SelectSukiModal';
import CashPaymentModal from '../features/pos/components/CashPaymentModal';
import SalesReportModal from '../features/pos/components/SalesReportModal';
import SuccessToast from '../features/pos/components/SuccessToast';
import ReceiptModal from '../features/pos/components/ReceiptModal';
import { chargeToSuki, chargeToNewSuki } from '../services/sukiService';
import { confirmCashPayment } from '../services/statsService';

export default function HomeTab({ settings, sukiList, setSukiList, todayStats, setTodayStats, shiftHistory, setShiftHistory, inventory, setInventory }) {
  const { cart, addToCart, clearCart, cartTotal } = useCart();

  // Modals & UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSelectSukiOpen, setIsSelectSukiOpen] = useState(false);
  const [isPayCashOpen, setIsPayCashOpen] = useState(false);
  const [isSalesReportOpen, setIsSalesReportOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  
  // Specific Form State passed down for convenience, though these could also be inside the modals if entirely isolated.
  const [cashReceived, setCashReceived] = useState('');
  
  // Notifications & Time
  const lowStockItems = inventory.filter(i => i.qty <= i.min);
  const [hasNotif, setHasNotif] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (lowStockItems.length > 0) setHasNotif(true);
  }, [lowStockItems.length]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (data, timeout = 4000) => {
    setSuccessData(data);
    setTimeout(() => setSuccessData(null), timeout);
  };

  // Handlers using Services
  const handleChargeToSuki = async (suki) => {
    const { total, dateStrForMsg, timeStr } = await chargeToSuki({ suki, cart, setSukiList, setTodayStats, inventory, setInventory });
    
    // Build SMS from template
    const template = settings?.smsTemplate || 'Maayong adlaw, {name}! Reminder lang gikan sa {storeName} bahin sa imong kasamtangang utang ledger nga nagkantidad og {balance}. Pwede ra nimo ma-settle sa tindahan kung hayahay na ka. Salamat kaayo!';
    const smsMsg = template
      .replaceAll('{name}', suki.name)
      .replaceAll('{balance}', `₱${(suki.balance + total).toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
      .replaceAll('{storeName}', settings?.storeName || 'ang tindahan');

    showToast({
      msg: `Charged to ${suki.name}'s ledger ₱${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} on ${dateStrForMsg} ${timeStr}`,
      sms: smsMsg,
      phone: suki.phone
    }, 8000);
    setIsSelectSukiOpen(false);
    clearCart();
  };

  const handleChargeToNewSuki = async ({ name, phone }) => {
    const { total, dateStrForMsg, timeStr } = await chargeToNewSuki({ name, phone, cart, setSukiList, setTodayStats, inventory, setInventory });
    
    // Build SMS from template
    const template = settings?.smsTemplate || 'Maayong adlaw, {name}! Reminder lang gikan sa {storeName} bahin sa imong kasamtangang utang ledger nga nagkantidad og {balance}. Pwede ra nimo ma-settle sa tindahan kung hayahay na ka. Salamat kaayo!';
    const smsMsg = template
      .replaceAll('{name}', name)
      .replaceAll('{balance}', `₱${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
      .replaceAll('{storeName}', settings?.storeName || 'ang tindahan');

    showToast({
      msg: `Charged to ${name}'s ledger ₱${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} on ${dateStrForMsg} ${timeStr}`,
      sms: smsMsg,
      phone: phone
    }, 8000);
    setIsSelectSukiOpen(false);
    clearCart();
  };

  const handleConfirmCash = () => {
    const { total, change } = confirmCashPayment({ cart, cashReceived, todayStats, setTodayStats, inventory, setInventory });
    const received = parseFloat(cashReceived) || total;
    // Show receipt modal
    setReceiptData({
      cart: [...cart],
      total,
      received,
      change,
      storeName: settings?.storeName || 'SukiLedger',
      timestamp: new Date().toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
    });
    showToast({
      msg: `Payment Received: ₱${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}. Sukli: ₱${change.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sms: ''
    });
    setIsPayCashOpen(false);
    clearCart();
    setCashReceived('');
  };

  // Recent Transactions sorting logic
  const [txSort, setTxSort] = useState('Newest');
  
  let sortedTransactions = [...(todayStats.transactions || [])];
  if (txSort === 'Alphabetical') sortedTransactions.sort((a, b) => a.name.localeCompare(b.name));
  else if (txSort === 'Highest Amount') sortedTransactions.sort((a, b) => b.amount - a.amount);
  else if (txSort === 'Lowest Amount') sortedTransactions.sort((a, b) => a.amount - b.amount);
  else sortedTransactions.sort((a, b) => b.id - a.id); // Newest first by default

  return (
    <div className="flex flex-col min-h-full relative pb-28">
      {/* HEADER Banner */}
      <div className="bg-emerald-600 text-white pt-8 pb-12 px-6 rounded-b-[2.5rem] flex justify-between items-start shadow-md">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Overview</h2>
          <p className="text-emerald-100 text-xs font-medium mt-1">
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-mono text-xl font-bold tracking-wider">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <div className="relative h-full flex items-center">
            <button
              onClick={() => { setIsNotifOpen(!isNotifOpen); setHasNotif(false); }}
              className="bg-emerald-500/30 p-2.5 rounded-full hover:bg-emerald-500/50 transition relative"
            >
              <Bell size={20} />
              {hasNotif && <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-emerald-600"></span>}
            </button>
            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-4 duration-200 overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notifications</p>
                  <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {lowStockItems.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">All stocks are good!</div>
                  ) : (
                    lowStockItems.map(item => (
                      <div key={item.id} className="p-4 flex gap-3 items-start bg-red-50/30 border-b border-red-50/50 last:border-0">
                        <div className="p-2 bg-red-100 text-red-500 rounded-xl mt-0.5"><Package size={16} /></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Low Stock Alert</p>
                          <p className="text-xs text-slate-600 mt-1">
                            <span className="font-semibold text-red-500">{item.name}</span> has reached its minimum threshold ({item.qty} items left).
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6 flex-1 flex flex-col gap-6">
        {/* SALES CARD */}
        <div onClick={() => setIsSalesReportOpen(true)} className="bg-white border border-emerald-50/60 p-6 rounded-3xl shadow-sm bg-gradient-to-br from-white to-emerald-50/20 flex justify-between items-center cursor-pointer hover:shadow-md hover:scale-[1.01] transition transform active:scale-95">
          {(() => {
            const todaySales = todayStats.cash + todayStats.credit;
            const lastShift = shiftHistory && shiftHistory.length > 0 ? shiftHistory[shiftHistory.length - 1] : null;
            const yesterdaySales = lastShift ? (lastShift.cash + lastShift.credit) : 0;
            const isGrowth = yesterdaySales === 0 ? true : todaySales >= yesterdaySales;
            const changePercent = yesterdaySales === 0 ? 100 : Math.abs(((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(1);
            const yesterdayColor = yesterdaySales > todaySales ? 'text-blue-500' : 'text-red-500';
            return (
              <>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Today's Sales</p>
                  <h3 className="text-3xl font-extrabold text-slate-800 mt-1">₱ {todaySales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isGrowth ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {isGrowth ? '+' : '-'}{changePercent}%
                      </span>
                      <span className="text-xs text-slate-400">vs yesterday</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Yesterday: <span className={`${yesterdayColor} font-bold`}>₱ {yesterdaySales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </p>
                  </div>
                </div>
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
              </>
            );
          })()}
        </div>

        {/* POS Grid */}
        <PosGrid inventory={inventory} onAddToCart={addToCart} onOpenAddModal={() => setIsAddModalOpen(true)} />

        {/* RECENT TRANSACTIONS */}
        <div className="flex flex-col gap-3 mb-6 mt-2">
          <div className="flex justify-between items-center px-1">
            <h4 className="font-bold text-slate-800 text-base">Recent Transactions</h4>
            <div className="flex gap-2">
              <select value={txSort} onChange={(e) => setTxSort(e.target.value)} className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-lg outline-none border border-emerald-100 shadow-sm cursor-pointer">
                <option value="Newest">Newest</option><option value="Alphabetical">Alphabetical</option><option value="Highest Amount">Highest Amount</option><option value="Lowest Amount">Lowest Amount</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-3 bg-white border border-slate-100/80 p-4 rounded-3xl shadow-sm">
            {sortedTransactions.length === 0 && <p className="text-center text-slate-400 text-xs py-4">No transactions found.</p>}
            {sortedTransactions.map((tx) => {
              const isCredit = tx.type === 'credit';
              const IconComp = isCredit ? Package : Package; // using Package for all items for simplicity
              const bgClass = isCredit ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500';
              return (
                <div key={tx.id} className="flex items-center justify-between py-2 last:border-0 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${bgClass}`}><IconComp size={18} /></div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{tx.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{tx.time} • {isCredit ? 'Utang' : 'Cash'}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">₱ {tx.amount.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CartPanel cart={cart} cartTotal={cartTotal} onPayCash={() => setIsPayCashOpen(true)} onChargeToSuki={() => setIsSelectSukiOpen(true)} onClear={clearCart} />

      {/* Modals */}
      {isAddModalOpen && <AddItemModal inventory={inventory} setInventory={setInventory} onClose={() => setIsAddModalOpen(false)} />}
      {isSelectSukiOpen && <SelectSukiModal sukiList={sukiList} cartTotal={cartTotal} onSelectExisting={handleChargeToSuki} onAddNewSuki={handleChargeToNewSuki} onClose={() => setIsSelectSukiOpen(false)} />}
      {isPayCashOpen && <CashPaymentModal cartTotal={cartTotal} cashReceived={cashReceived} setCashReceived={setCashReceived} onConfirm={handleConfirmCash} onClose={() => setIsPayCashOpen(false)} />}
      {isSalesReportOpen && <SalesReportModal todayStats={todayStats} setTodayStats={setTodayStats} shiftHistory={shiftHistory} setShiftHistory={setShiftHistory} onClose={() => setIsSalesReportOpen(false)} onSuccessToast={showToast} />}
      {receiptData && <ReceiptModal receiptData={receiptData} onClose={() => setReceiptData(null)} />}
      
      <SuccessToast data={successData} onClose={() => setSuccessData(null)} />
    </div>
  );
}
