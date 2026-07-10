import React, { useState, useEffect } from 'react';
import { Plus, UserPlus, Bell, ShoppingBag, Smartphone, Utensils, Coffee, Droplet, Package, ShoppingCart, ChevronRight, X, Search, CheckCircle, Copy, Check, Send, BookOpen, Share2 } from 'lucide-react';

export default function HomeTab({ sukiList, setSukiList, todayStats, setTodayStats, shiftHistory, setShiftHistory, inventory, setInventory }) {
  const [cart, setCart] = useState([]);
  const [txFilter, setTxFilter] = useState('Today');
  const [txSort, setTxSort] = useState('Newest');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', cost: '', price: '', stock: '', categoryIndex: 0 });
  const [posSearch, setPosSearch] = useState('');

  const ITEM_CATEGORIES = [
    { label: 'General', icon: Package, color: 'bg-emerald-50 text-emerald-500' },
    { label: 'Kape', icon: Coffee, color: 'bg-orange-50 text-orange-500' },
    { label: 'Bugnaw', icon: Droplet, color: 'bg-blue-50 text-blue-500' },
    { label: 'Pagkaon', icon: Utensils, color: 'bg-red-50 text-red-500' },
    { label: 'Load', icon: Smartphone, color: 'bg-indigo-50 text-indigo-500' }
  ];

  const [hasNotif, setHasNotif] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Live Date and Time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [isSelectSukiOpen, setIsSelectSukiOpen] = useState(false);
  const [sukiSearch, setSukiSearch] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Pay Cash Modal State
  const [isPayCashOpen, setIsPayCashOpen] = useState(false);
  const [cashReceived, setCashReceived] = useState('');

  // Sales Report Modal State
  const [isSalesReportOpen, setIsSalesReportOpen] = useState(false);
  const [isEditingStartingCash, setIsEditingStartingCash] = useState(false);
  const [startingCashInput, setStartingCashInput] = useState('');
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [expandedShifts, setExpandedShifts] = useState({});

  const filteredSukiList = sukiList.filter(s => s.name.toLowerCase().includes(sukiSearch.toLowerCase()));

  const handleChargeToSuki = (suki) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString();

    const smsText = `Hi ${suki.name}! Narekord na sa sistema ang imong dugang utang nga ₱${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} karong ${timeStr}. Salamat sa pagsalig!`;

    // UPDATE GLOBAL SUKI LIST
    const cartDesc = cart.map(item => `${item.qty}x ${item.name}`).join(', ');

    const costTotal = cart.reduce((sum, item) => sum + ((item.cost || item.price * 0.8) * item.qty), 0);
    setTodayStats(prev => ({
      ...prev,
      credit: prev.credit + total,
      profit: prev.profit + (total - costTotal)
    }));

    setSukiList(prev => prev.map(s => {
      if (s.id === suki.id) {
        return {
          ...s,
          balance: s.balance + total,
          lastActive: 'Just now',
          history: [
            { desc: cartDesc, date: dateStr, amt: total },
            ...s.history
          ]
        };
      }
      return s;
    }));

    setSuccessData({
      msg: `Charged to ${suki.name}'s ledger ₱${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} on ${dateStr} ${timeStr}`,
      sms: smsText,
      phone: suki.phone
    });
    setCopied(false);
    setIsSelectSukiOpen(false);
    clearCart();
    setSukiSearch('');

    setTimeout(() => {
      setSuccessData(null);
    }, 8000); // 8 seconds so they have time to copy
  };

  const handleConfirmCashPayment = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const received = parseFloat(cashReceived) || total;
    const change = received - total;

    setSuccessData({
      msg: `Payment Received: ₱${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}. Sukli: ₱${change.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sms: '' // Empty so we don't show the SMS section
    });

    const costTotal = cart.reduce((sum, item) => sum + ((item.cost || item.price * 0.8) * item.qty), 0);
    setTodayStats(prev => ({
      ...prev,
      cash: prev.cash + total,
      profit: prev.profit + (total - costTotal)
    }));

    setIsPayCashOpen(false);
    clearCart();
    setCashReceived('');

    setTimeout(() => {
      setSuccessData(null);
    }, 4000); // Shorter timeout for cash payments since there's no SMS to copy
  };

  const handleCloseShift = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Save to history
    setShiftHistory(prev => [
      {
        id: Date.now(),
        date: dateStr,
        cash: todayStats.cash,
        credit: todayStats.credit,
        profit: todayStats.profit,
        startingCash: todayStats.startingCash,
        transactions: [] // For now, we just pass empty since we aren't accumulating a global list today.
      },
      ...prev
    ]);

    // Reset stats for the next day
    setTodayStats(prev => ({
      ...prev,
      cash: 0,
      credit: 0,
      profit: 0
    }));
    
    // Close modals
    setIsConfirmingClose(false);
    setIsSalesReportOpen(false);
    
    // Show toast
    setSuccessData({
      msg: `Day shift closed successfully. Sales history archived.`,
      sms: '' 
    });

    setTimeout(() => {
      setSuccessData(null);
    }, 4000);
  };

  const handleShareReport = () => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const total = todayStats.cash + todayStats.credit;
    
    const smsText = `SukiLedger Report (${dateStr}):\nTotal Sales: ₱${total.toLocaleString('en-US', {minimumFractionDigits: 2})}\nCash: ₱${todayStats.cash.toLocaleString('en-US', {minimumFractionDigits: 2})}\nUtang Logged: ₱${todayStats.credit.toLocaleString('en-US', {minimumFractionDigits: 2})}\nEst. Ginansya: ₱${todayStats.profit.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    
    setSuccessData({
      msg: `Sales Report is ready to be shared!`,
      sms: smsText,
      phone: '' // Usually the owner's phone number
    });
    setCopied(false);
  };

  const transactions = [
    { id: 1, name: '2x Coca-Cola 1.5L', time: '10:42 AM', amount: 150.00, icon: ShoppingBag, bg: 'bg-blue-50 text-blue-500', date: 'Today' },
    { id: 2, name: '1x Load Globe 50', time: '09:15 AM', amount: 53.00, icon: Smartphone, bg: 'bg-indigo-50 text-indigo-500', date: 'Today' },
    { id: 3, name: 'Bread, Eggs, Milk', time: 'Yesterday, 08:30 AM', amount: 210.00, icon: Utensils, bg: 'bg-amber-50 text-amber-500', date: 'Yesterday' },
    { id: 4, name: 'Pancit Canton x4', time: 'Monday, 07:45 AM', amount: 60.00, icon: ShoppingBag, bg: 'bg-orange-50 text-orange-500', date: 'This Week' },
    { id: 5, name: 'Smart Load 50', time: 'Last Oct 12, 02:15 PM', amount: 53.00, icon: Smartphone, bg: 'bg-green-50 text-green-500', date: 'Last Week' },
    { id: 6, name: '1x Bear Brand 150g', time: 'Oct 02, 10:00 AM', amount: 55.00, icon: Coffee, bg: 'bg-yellow-50 text-yellow-600', date: 'This Month' },
    { id: 7, name: '1x Safeguard White', time: 'Sep 15, 09:30 AM', amount: 35.00, icon: ShoppingBag, bg: 'bg-slate-50 text-slate-500', date: 'Last Month' },
  ];

  const filterLogic = {
    'Today': ['Today'],
    'Yesterday': ['Yesterday'],
    'This Week': ['Today', 'Yesterday', 'This Week'],
    'Last Week': ['Last Week'],
    'This Month': ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month'],
    'Last Month': ['Last Month']
  };

  const filteredTransactions = transactions.filter(tx => filterLogic[txFilter].includes(tx.date));

  let sortedTransactions = [...filteredTransactions];
  if (txSort === 'Alphabetical') {
    sortedTransactions.sort((a, b) => a.name.localeCompare(b.name));
  } else if (txSort === 'Highest Amount') {
    sortedTransactions.sort((a, b) => b.amount - a.amount);
  } else if (txSort === 'Lowest Amount') {
    sortedTransactions.sort((a, b) => a.amount - b.amount);
  } else {
    // Newest: assuming smaller ID is more recent based on mock data
    sortedTransactions.sort((a, b) => a.id - b.id);
  }

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.cost || !newItem.stock) return;
    const newPrice = parseFloat(newItem.price);
    const newCost = parseFloat(newItem.cost);
    const newQty = parseInt(newItem.stock, 10);
    const selectedCat = ITEM_CATEGORIES[newItem.categoryIndex];
    const newProduct = {
      id: Date.now(),
      name: newItem.name,
      price: newPrice,
      cost: newCost,
      qty: newQty,
      min: 5, // default min stock alert
      icon: selectedCat.icon,
      color: selectedCat.color
    };
    setInventory([...inventory, newProduct]);
    setNewItem({ name: '', cost: '', price: '', stock: '', categoryIndex: 0 });
    setIsAddModalOpen(false);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

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
          {/* LIVE CLOCK */}
          <div className="text-right">
            <p className="font-mono text-xl font-bold tracking-wider">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>

          <div className="relative h-full flex items-center">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setHasNotif(false);
              }}
              className="bg-emerald-500/30 p-2.5 rounded-full hover:bg-emerald-500/50 transition relative"
            >
              <Bell size={20} />
              {hasNotif && <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-emerald-600"></span>}
            </button>

          {/* NOTIFICATION PANEL */}
          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-4 duration-200 overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notifications</p>
                <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              </div>
              <div className="p-4 flex gap-3 items-start bg-red-50/30">
                <div className="p-2 bg-red-100 text-red-500 rounded-xl mt-0.5">
                  <Package size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Low Stock Alert</p>
                  <p className="text-xs text-slate-600 mt-1">
                    <span className="font-semibold text-red-500">Pancit Canton</span> has reached its minimum threshold (3 items left).
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6 flex-1 flex flex-col gap-6">
        {/* SALES CARD */}
        <div
          onClick={() => setIsSalesReportOpen(true)}
          className="bg-white border border-emerald-50/60 p-6 rounded-3xl shadow-sm bg-gradient-to-br from-white to-emerald-50/20 flex justify-between items-center cursor-pointer hover:shadow-md hover:scale-[1.01] transition transform active:scale-95"
        >
          {(() => {
            const todaySales = todayStats.cash + todayStats.credit;
            const yesterdaySales = 1102.22;
            const isGrowth = todaySales >= yesterdaySales;
            const changePercent = Math.abs(((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(1);

            // "kung taas sa karun nga sales yellow or blue kung gamay sa karun red"
            // Color for yesterday's sales value depending on if it's higher/lower than today.
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

        {/* QUICK POS GRID */}
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
            {inventory.filter(item => item.name.toLowerCase().includes(posSearch.toLowerCase())).map((prod) => {
              const IconComp = prod.icon;
              return (
                <button
                  key={prod.id}
                  onClick={() => addToCart(prod)}
                  className="bg-white border border-slate-100 p-2 py-2.5 h-28 rounded-2xl shadow-sm hover:border-emerald-200 hover:shadow-md transition active:scale-95 flex flex-col items-center justify-between text-center relative overflow-hidden group"
                >
                  <div className={`p-2 rounded-xl ${prod.color} group-hover:scale-110 transition-transform`}>
                    <IconComp size={18} />
                  </div>
                  <div className="flex flex-col items-center w-full px-1">
                    <p className="font-semibold text-slate-700 text-[11px] leading-tight line-clamp-2 w-full">{prod.name}</p>
                    <p className="font-bold text-slate-800 text-[11px] mt-0.5">₱{prod.price}</p>
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-50/50 border border-dashed border-emerald-300 p-2 py-2.5 h-28 rounded-2xl hover:bg-emerald-50 transition active:scale-95 flex flex-col items-center justify-center text-center gap-2 text-emerald-600"
            >
              <div className="p-2 rounded-full bg-emerald-100">
                <Plus size={18} />
              </div>
              <p className="font-bold text-[11px] mt-0.5">Add Item</p>
            </button>
          </div>
        </div>
        {/* RECENT TRANSACTIONS */}
        <div className="flex flex-col gap-3 mb-6 mt-2">
          <div className="flex justify-between items-center px-1">
            <h4 className="font-bold text-slate-800 text-base">Recent Transactions</h4>
            <div className="flex gap-2">
              <select
                value={txSort}
                onChange={(e) => setTxSort(e.target.value)}
                className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-lg outline-none border border-emerald-100 shadow-sm cursor-pointer"
              >
                <option value="Newest">Newest</option>
                <option value="Alphabetical">Alphabetical</option>
                <option value="Highest Amount">Highest Amount</option>
                <option value="Lowest Amount">Lowest Amount</option>
              </select>
              <select
                value={txFilter}
                onChange={(e) => setTxFilter(e.target.value)}
                className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-lg outline-none border border-emerald-100 shadow-sm cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Week">This Week</option>
                <option value="Last Week">Last Week</option>
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-3 bg-white border border-slate-100/80 p-4 rounded-3xl shadow-sm">
            {sortedTransactions.length === 0 && (
              <p className="text-center text-slate-400 text-xs py-4">No transactions found.</p>
            )}
            {sortedTransactions.map((tx) => {
              const IconComp = tx.icon;
              return (
                <div key={tx.id} className="flex items-center justify-between py-2 last:border-0 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${tx.bg}`}><IconComp size={18} /></div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{tx.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{tx.time}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">₱ {tx.amount.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FLOATING CART PANEL */}
      {cart.length > 0 && (
        <div className="fixed bottom-[4.5rem] md:bottom-6 left-0 right-0 px-4 md:px-0 md:max-w-4xl md:mx-auto z-40 animate-slide-up">
          <div className="bg-slate-900 rounded-3xl p-5 shadow-2xl flex flex-col gap-3 border border-slate-700">
            {/* Receipt Header */}
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400">
                  <ShoppingCart size={18} />
                </div>
                <h3 className="font-bold text-white text-base tracking-wide">Transaction</h3>
              </div>
              <button onClick={clearCart} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            {/* Receipt Items (Scrollable if too many) */}
            <div className="flex flex-col gap-2.5 max-h-36 overflow-y-auto pr-1 font-mono text-sm text-slate-300">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <span className="truncate">{item.qty}x {item.name}</span>
                  <span className="whitespace-nowrap">- ₱ {(item.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>

            {/* Receipt Total */}
            <div className="border-t-2 border-dashed border-slate-600 pt-3 pb-3 flex justify-between items-end font-mono">
              <span className="font-bold text-slate-300 text-lg">Total</span>
              <span className="font-black text-white text-2xl relative">
                ₱ {cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                {/* Double Underline typical of receipts */}
                <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white rounded-full"></div>
                <div className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-white rounded-full"></div>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={() => setIsSelectSukiOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-2 rounded-xl transition flex justify-center items-center gap-2 text-sm"
              >
                Charge to Suki
              </button>
              <button
                onClick={() => {
                  setCashReceived(cartTotal.toString());
                  setIsPayCashOpen(true);
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-2 rounded-xl transition flex justify-center items-center gap-2 text-sm shadow-emerald-500/30 shadow-lg"
              >
                Pay Cash <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="bg-emerald-600 px-6 py-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Add New POS Item</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="bg-emerald-500/30 p-1.5 rounded-full hover:bg-emerald-500/50">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-6 flex flex-col gap-5">
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
                        <div className={`p-2 rounded-xl ${cat.color}`}>
                          <IconComp size={20} />
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Kopiko Blanca"
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cost Price (Puhunan)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newItem.cost}
                    onChange={e => setNewItem({ ...newItem, cost: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Selling Price (Baligya)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newItem.price}
                    onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Initial Stock (Pila ka Buok)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 24"
                  value={newItem.stock}
                  onChange={e => setNewItem({ ...newItem, stock: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                />
              </div>

              <button
                type="submit"
                disabled={!(newItem.name.trim() !== '' && parseFloat(newItem.price) > 0 && newItem.cost !== '' && newItem.stock !== '')}
                className={`w-full font-bold py-3.5 rounded-xl transition mt-2 ${
                  (newItem.name.trim() !== '' && parseFloat(newItem.price) > 0 && newItem.cost !== '' && newItem.stock !== '')
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Save Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SELECT SUKI MODAL */}
      {isSelectSukiOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 h-[80vh] flex flex-col">
            <div className="bg-emerald-600 px-6 py-5 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold text-lg">Select Suki</h3>
              <button onClick={() => setIsSelectSukiOpen(false)} className="bg-emerald-500/30 p-1.5 rounded-full hover:bg-emerald-500/50">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 shrink-0 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Pangitaa si Suki..."
                  value={sukiSearch}
                  onChange={e => setSukiSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {filteredSukiList.length === 0 && (
                <p className="text-center text-slate-400 text-sm mt-4">Suki not found.</p>
              )}
              {filteredSukiList.map(suki => (
                <button
                  key={suki.id}
                  onClick={() => handleChargeToSuki(suki)}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-300 hover:bg-emerald-50/50 transition active:scale-95 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                      {suki.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{suki.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Current Balance: ₱{suki.balance.toLocaleString()}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS TOAST */}
      {successData && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] w-11/12 max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={24} />
              <div className="flex-1">
                <p className="font-bold text-emerald-700 text-sm">Transaction Success!</p>
                <p className="text-slate-600 text-xs mt-1 leading-snug">{successData.msg}</p>
              </div>
              <button onClick={() => setSuccessData(null)} className="text-slate-400 hover:text-slate-600 shrink-0">
                <X size={16} />
              </button>
            </div>

            {successData.sms && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex flex-col gap-2">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Auto-SMS / Messenger Alert</p>
                <p className="text-xs text-slate-700 italic border-l-2 border-emerald-300 pl-2">"{successData.sms}"</p>

                <div className="flex gap-2 mt-2">
                  {/* BUTTON 1: DIRECT SEND VIA SMS APP */}
                  <button
                    onClick={() => {
                      const smsLink = `sms:${successData.phone}?body=${encodeURIComponent(successData.sms)}`;
                      window.open(smsLink, '_self');
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Send size={14} /> Send SMS
                  </button>

                  {/* BUTTON 2: BACKUP COPY TO CLIPBOARD */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(successData.sms);
                      setCopied(true);
                    }}
                    className={`border border-slate-200 font-bold py-2.5 px-3.5 rounded-xl text-xs transition flex items-center justify-center ${copied ? 'bg-emerald-500 text-white border-emerald-500' : 'text-slate-600 hover:bg-slate-50'}`}
                    title="Copy Text Only"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CASH CHANGE CALCULATOR MODAL */}
      {isPayCashOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-600 px-6 py-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Cash Payment</h3>
              <button onClick={() => setIsPayCashOpen(false)} className="bg-emerald-500/30 p-1.5 rounded-full hover:bg-emerald-500/50">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6">

              {/* Total Due Display */}
              <div className="flex justify-between items-end">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Due</p>
                <p className="text-2xl font-black text-slate-800">₱{cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[1000, 500, 200, 100, 50].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setCashReceived(amt.toString())}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2.5 rounded-xl border border-emerald-100 transition shadow-sm active:scale-95"
                  >
                    ₱{amt}
                  </button>
                ))}
                <button
                  onClick={() => setCashReceived(cartTotal.toString())}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition shadow-sm active:scale-95"
                >
                  Exact
                </button>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cash Received</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₱</span>
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={e => setCashReceived(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-8 pr-4 py-3.5 rounded-2xl font-black text-xl text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                  />
                </div>
              </div>

              {/* Change (Sukli) Display */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sukli (Change)</p>
                <p className={`text-4xl font-black ${(parseFloat(cashReceived) || 0) >= cartTotal ? 'text-emerald-600' : 'text-red-500'}`}>
                  ₱{Math.max(0, (parseFloat(cashReceived) || 0) - cartTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                {(parseFloat(cashReceived) || 0) < cartTotal && (
                  <p className="text-red-500 text-xs font-bold mt-2">Kuwang ang kwarta!</p>
                )}
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmCashPayment}
                disabled={(parseFloat(cashReceived) || 0) < cartTotal}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition mt-2 text-lg"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DAILY SALES REPORT MODAL */}
      {isSalesReportOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 h-[75vh] flex flex-col relative">

            {/* Modal Header */}
            <div className="bg-emerald-600 px-6 py-6 pb-12 flex justify-between items-start text-white shrink-0 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500 rounded-full opacity-50 blur-2xl"></div>
              <div>
                <h3 className="font-extrabold text-xl">{showHistoryView ? 'Sales History' : 'Daily Sales Report'}</h3>
                {!showHistoryView && <p className="text-emerald-100 text-xs mt-1 font-medium">As of Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
              </div>
              <div className="flex gap-2 z-10">
                {!showHistoryView && (
                  <button 
                    onClick={handleShareReport}
                    className="bg-emerald-500/30 p-2 rounded-full hover:bg-emerald-500/50 transition backdrop-blur-sm"
                    title="Share Report"
                  >
                    <Share2 size={16} />
                  </button>
                )}
                <button 
                  onClick={() => setShowHistoryView(!showHistoryView)} 
                  className="bg-emerald-500/30 px-3 py-1.5 rounded-full hover:bg-emerald-500/50 transition backdrop-blur-sm text-xs font-bold"
                >
                  {showHistoryView ? 'Back to Today' : 'History'}
                </button>
                <button onClick={() => setIsSalesReportOpen(false)} className="bg-emerald-500/30 p-2 rounded-full hover:bg-emerald-500/50 transition backdrop-blur-sm">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 pb-6 flex-1 overflow-y-auto -mt-6 z-10 relative">
              
              {showHistoryView ? (
                <div className="flex flex-col gap-4 pt-4">
                  {shiftHistory.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm mt-10 font-medium">No sales history found.</p>
                  ) : (
                    shiftHistory.map((shift) => (
                      <div key={shift.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-700">{shift.date}</span>
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">
                            Total: ₱{(shift.cash + shift.credit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                            <span className="text-slate-500">Cash Received:</span>
                            <span className="font-bold text-slate-700">₱{shift.cash.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center bg-orange-50/50 p-2 rounded-lg border border-orange-100">
                            <span className="text-slate-500">Utang Logged:</span>
                            <span className="font-bold text-slate-700">₱{shift.credit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 col-span-2">
                            <span className="text-emerald-700 font-bold">Est. Ginansya:</span>
                            <span className="font-black text-emerald-700 text-sm">₱{shift.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>

                        {/* View Transactions Toggle */}
                        <div className="mt-1 border-t border-slate-100 pt-3">
                          <button
                            onClick={() => setExpandedShifts(prev => ({ ...prev, [shift.id]: !prev[shift.id] }))}
                            className="w-full text-xs font-bold text-slate-500 hover:text-emerald-600 transition flex items-center justify-center gap-1.5 py-1"
                          >
                            {expandedShifts[shift.id] ? 'Hide Transactions' : 'View Transactions List'}
                            <ChevronRight size={14} className={`transition-transform duration-200 ${expandedShifts[shift.id] ? 'rotate-90' : ''}`} />
                          </button>
                          
                          {/* Receipt Breakdown Expandable Area */}
                          {expandedShifts[shift.id] && (
                            <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-200 border-dashed animate-in slide-in-from-top-2 fade-in duration-200 font-mono text-xs">
                              {(!shift.transactions || shift.transactions.length === 0) ? (
                                <p className="text-center text-slate-400 py-2 font-sans">No detailed transactions saved.</p>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  {shift.transactions.map((tx) => (
                                    <div key={tx.id} className="flex justify-between items-start gap-3 border-b border-slate-200/60 last:border-0 pb-2 last:pb-0">
                                      <div className="flex-1 pr-2">
                                        <p className="font-semibold text-slate-700 leading-snug">{tx.desc}</p>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${tx.type.includes('Utang') ? 'text-orange-500' : 'text-blue-500'}`}>
                                          {tx.type}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <span className="font-black text-slate-800 whitespace-nowrap text-sm">₱{tx.total.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                    ))
                  )}
                </div>
              ) : (
                <>
                  {/* Grand Total */}
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 mb-4 flex flex-col items-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Sales Generated</p>
                <p className="text-4xl font-black text-emerald-600">
                  ₱{(todayStats.cash + todayStats.credit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Cash Drawer Breakdown (Full Width) */}
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl mb-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-0.5">Expected Cash in Drawer</p>
                    <p className="text-2xl font-black text-blue-800">₱{(todayStats.cash + todayStats.startingCash).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 relative z-10">
                  <div className="flex justify-between items-center text-xs text-blue-800/80">
                    <span className="font-semibold">Starting Cash (Sinsilyo):</span>
                    {isEditingStartingCash ? (
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-700">₱</span>
                        <input 
                          type="number" 
                          autoFocus
                          value={startingCashInput}
                          onChange={(e) => setStartingCashInput(e.target.value)}
                          onBlur={() => {
                            setTodayStats(prev => ({ ...prev, startingCash: parseFloat(startingCashInput) || 0 }));
                            setIsEditingStartingCash(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setTodayStats(prev => ({ ...prev, startingCash: parseFloat(startingCashInput) || 0 }));
                              setIsEditingStartingCash(false);
                            }
                          }}
                          className="w-20 px-1.5 py-0.5 text-right rounded border border-blue-300 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 z-50 relative"
                        />
                      </div>
                    ) : (
                      <span 
                        onClick={() => {
                          setStartingCashInput(todayStats.startingCash.toString());
                          setIsEditingStartingCash(true);
                        }}
                        className="font-bold border-b border-dashed border-blue-400 cursor-pointer hover:text-blue-900 transition relative z-10"
                        title="Tap to edit"
                      >
                        ₱{todayStats.startingCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs text-blue-800/80">
                    <span className="font-semibold">Cash Received (Sales):</span>
                    <span className="font-bold">+ ₱{todayStats.cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Breakdown Grid for Debts & Profit */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* Credit (Utang) Sales */}
                <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex flex-col justify-center">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-2">
                    <BookOpen size={16} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Debts Logged</p>
                  <p className="text-lg font-black text-slate-700">₱{todayStats.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                
                {/* Profit Indicator */}
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-100 rounded-full opacity-50 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 shadow-sm mb-2 relative z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-0.5">Est. Ginansya</p>
                    <p className="text-lg font-black text-emerald-700">₱{todayStats.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>

              {/* Close Shift Section */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                {!isConfirmingClose ? (
                  <button 
                    onClick={() => setIsConfirmingClose(true)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-3.5 rounded-xl transition text-sm flex justify-center items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Close Shop / Reset Day
                  </button>
                ) : (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl animate-in zoom-in-95 duration-200">
                    <p className="text-sm font-bold text-red-700 text-center mb-3">
                      Sigurado ka nga i-close ang shift karong adlawa? Gi-save na kini sa imong History.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsConfirmingClose(false)}
                        className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl transition text-sm shadow-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleCloseShift}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm shadow-red-500/30"
                      >
                        Yes, Close Shift
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
