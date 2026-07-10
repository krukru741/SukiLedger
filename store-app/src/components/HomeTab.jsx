import React, { useState } from 'react';
import { Plus, UserPlus, Bell, ShoppingBag, Smartphone, Utensils, Coffee, Droplet, Package, ShoppingCart, ChevronRight, X } from 'lucide-react';

export default function HomeTab() {
  const [cart, setCart] = useState([]);
  const [txFilter, setTxFilter] = useState('Today');
  const [txSort, setTxSort] = useState('Newest');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  
  const [hasNotif, setHasNotif] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

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

  // Top Products State
  const [topProducts, setTopProducts] = useState([
    { id: 1, name: 'Coca-Cola 1.5L', price: 75.00, icon: Utensils, color: 'bg-red-50 text-red-500' },
    { id: 2, name: 'Pancit Canton', price: 15.00, icon: Package, color: 'bg-orange-50 text-orange-500' },
    { id: 3, name: 'Globe Load 50', price: 53.00, icon: Smartphone, color: 'bg-blue-50 text-blue-500' },
    { id: 4, name: 'Smart Load 50', price: 53.00, icon: Smartphone, color: 'bg-green-50 text-green-500' },
    { id: 5, name: 'Bear Brand 150g', price: 55.00, icon: Coffee, color: 'bg-yellow-50 text-yellow-600' },
    { id: 6, name: 'Kopiko Brown', price: 12.00, icon: Coffee, color: 'bg-amber-50 text-amber-700' },
    { id: 7, name: 'Repacked Sugar', price: 20.00, icon: ShoppingBag, color: 'bg-slate-100 text-slate-500' },
    { id: 8, name: 'Ice Tubig', price: 3.00, icon: Droplet, color: 'bg-cyan-50 text-cyan-500' },
  ]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    const newProduct = {
      id: Date.now(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      icon: Package, // default icon
      color: 'bg-emerald-50 text-emerald-500'
    };
    setTopProducts([...topProducts, newProduct]);
    setNewItem({ name: '', price: '' });
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
      <div className="bg-emerald-600 text-white pt-8 pb-12 px-6 rounded-b-[2.5rem] flex justify-between items-center shadow-md">
        <h2 className="text-2xl font-bold tracking-wide">Overview</h2>
        <div className="relative">
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

      <div className="px-5 -mt-6 flex-1 flex flex-col gap-6">
        {/* SALES CARD */}
        <div className="bg-white border border-emerald-50/60 p-6 rounded-3xl shadow-sm bg-gradient-to-br from-white to-emerald-50/20 flex justify-between items-center">
          {(() => {
            const todaySales = 1240.00;
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
                  <h3 className="text-3xl font-extrabold text-slate-800 mt-1">₱ {todaySales.toLocaleString('en-US', {minimumFractionDigits: 2})}</h3>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isGrowth ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {isGrowth ? '+' : '-'}{changePercent}%
                      </span>
                      <span className="text-xs text-slate-400">vs yesterday</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Yesterday: <span className={`${yesterdayColor} font-bold`}>₱ {yesterdaySales.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
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
          <div className="grid grid-cols-4 gap-3">
            {topProducts.map((prod) => {
              const IconComp = prod.icon;
              return (
                <button 
                  key={prod.id} 
                  onClick={() => addToCart(prod)}
                  className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm hover:border-emerald-200 hover:shadow-md transition active:scale-95 flex flex-col items-center text-center gap-2 relative overflow-hidden group"
                >
                  <div className={`p-2.5 rounded-xl ${prod.color} group-hover:scale-110 transition-transform`}>
                    <IconComp size={20} />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-slate-700 text-[10px] leading-tight line-clamp-2">{prod.name}</p>
                    <p className="font-bold text-slate-800 text-xs mt-0.5">₱{prod.price}</p>
                  </div>
                </button>
              );
            })}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-50/50 border border-dashed border-emerald-300 p-3 rounded-2xl hover:bg-emerald-50 transition active:scale-95 flex flex-col items-center justify-center text-center gap-2 text-emerald-600"
            >
              <div className="p-2 rounded-full bg-emerald-100">
                <Plus size={20} />
              </div>
              <p className="font-bold text-xs mt-0.5">Add Item</p>
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
          <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl flex flex-col gap-4 border border-slate-700">
            {/* Cart Header & Items Preview */}
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-emerald-500 p-2.5 rounded-full text-white">
                    <ShoppingCart size={20} />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-slate-900">
                    {cartItemCount}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-lg leading-none">₱ {cartTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                    {cart.map(item => `${item.qty}x ${item.name}`).join(', ')}
                  </p>
                </div>
              </div>
              <button onClick={clearCart} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-2 rounded-xl transition flex justify-center items-center gap-2 text-sm">
                Charge to Suki
              </button>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-2 rounded-xl transition flex justify-center items-center gap-2 text-sm shadow-emerald-500/30 shadow-lg">
                Pay Cash <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="bg-emerald-600 px-6 py-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Add New POS Item</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="bg-emerald-500/30 p-1.5 rounded-full hover:bg-emerald-500/50">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="e.g. Kopiko Blanca"
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Price (₱)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={newItem.price}
                  onChange={e => setNewItem({...newItem, price: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition mt-2"
              >
                Save Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
