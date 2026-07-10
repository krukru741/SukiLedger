const { useState, useEffect } = React;

// --- Helper Components ---

const Icon = ({ name, className = "" }) => {
    useEffect(() => {
        lucide.createIcons();
    });
    return <i data-lucide={name} className={className}></i>;
};

const Header = ({ title }) => (
    <div className="pt-12 pb-4 px-6 bg-emerald-600 rounded-b-[2rem] shadow-md z-10 relative">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            <div className="bg-emerald-500 p-2 rounded-full cursor-pointer hover:bg-emerald-400 transition shadow-sm">
                <Icon name="bell" className="text-white w-5 h-5" />
            </div>
        </div>
    </div>
);

// --- Views ---

const Dashboard = () => {
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-28">
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-3xl p-6 shadow-sm border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Icon name="wallet" className="w-16 h-16 text-emerald-600" />
                </div>
                <p className="text-emerald-800/70 text-sm font-semibold mb-1">Today's Sales</p>
                <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">₱ 1,240.00</h2>
                <div className="flex items-center mt-4 text-sm">
                    <span className="flex items-center text-emerald-700 font-bold bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                        <Icon name="trending-up" className="w-4 h-4 mr-1 stroke-[3]" />
                        +12.5%
                    </span>
                    <span className="text-slate-500 ml-2 font-medium">vs yesterday</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button className="bg-emerald-500 hover:bg-emerald-600 transition p-5 rounded-3xl flex flex-col items-center justify-center space-y-3 shadow-sm active:scale-95 group">
                    <div className="bg-white/20 p-3.5 rounded-2xl text-white group-hover:bg-white/30 transition">
                        <Icon name="plus" className="w-6 h-6 stroke-[3]" />
                    </div>
                    <span className="text-white font-semibold text-sm">New Sale</span>
                </button>
                <button className="bg-white hover:bg-slate-50 transition p-5 rounded-3xl flex flex-col items-center justify-center space-y-3 border border-slate-200 shadow-sm active:scale-95 group">
                    <div className="bg-slate-100 p-3.5 rounded-2xl text-slate-700 group-hover:bg-slate-200 transition">
                        <Icon name="user-plus" className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <span className="text-slate-700 font-semibold text-sm">Add Suki</span>
                </button>
            </div>

            {/* Recent Transactions */}
            <div>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-bold text-slate-800 text-lg">Recent Transactions</h3>
                    <span className="text-emerald-600 text-sm font-semibold cursor-pointer hover:text-emerald-700">See all</span>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
                    {[
                        { time: '10:42 AM', items: '2x Coca-Cola 1.5L', price: '₱ 150.00', icon: 'shopping-bag' },
                        { time: '09:15 AM', items: '1x Load Globe 50', price: '₱ 53.00', icon: 'smartphone' },
                        { time: '08:30 AM', items: 'Bread, Eggs, Milk', price: '₱ 210.00', icon: 'shopping-basket' },
                    ].map((tx, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
                            <div className="flex items-center space-x-4">
                                <div className="bg-slate-100 p-2.5 rounded-xl text-slate-600">
                                    <Icon name={tx.icon} className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{tx.items}</p>
                                    <p className="text-xs font-medium text-slate-400 mt-0.5">{tx.time}</p>
                                </div>
                            </div>
                            <span className="font-bold text-slate-700">{tx.price}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Inventory = () => {
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-28">
            <div className="relative group">
                <Icon name="search" className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition" />
                <input 
                    type="text" 
                    placeholder="Search inventory..." 
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-sm transition"
                />
            </div>

            <div className="grid gap-3.5">
                {[
                    { name: 'Coca-Cola 1.5L', stock: 12, price: '₱ 75.00', status: 'Good' },
                    { name: 'Pancit Canton', stock: 3, price: '₱ 15.00', status: 'Low Stock' },
                    { name: 'Bear Brand 150g', stock: 24, price: '₱ 55.00', status: 'Good' },
                    { name: 'Lucky Me Noodles', stock: 0, price: '₱ 12.00', status: 'Out of Stock' },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-4.5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:border-emerald-100 transition p-4">
                        <div className="flex items-center space-x-4">
                            <div className={`w-1.5 h-12 rounded-full ${item.stock === 0 ? 'bg-red-500' : item.stock < 5 ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
                            <div>
                                <h4 className="font-bold text-slate-800">{item.name}</h4>
                                <p className="text-xs font-medium text-slate-500 mt-1">
                                    Stock: <span className={item.stock === 0 ? 'text-red-500 font-bold' : item.stock < 5 ? 'text-amber-500 font-bold' : 'text-emerald-600 font-bold'}>{item.stock}</span> 
                                    <span className="mx-2 text-slate-300">•</span> 
                                    {item.price}
                                </p>
                            </div>
                        </div>
                        <button className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition p-2.5 rounded-xl">
                            <Icon name="edit-2" className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SukiLedger = () => {
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-28">
            <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <p className="text-slate-400 text-sm font-semibold mb-1">Total Utang to Collect</p>
                        <h2 className="text-4xl font-extrabold tracking-tight">₱ 3,450.00</h2>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                        <Icon name="users" className="w-6 h-6 text-emerald-400" />
                    </div>
                </div>
                <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.98]">
                    Record Payment
                </button>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-bold text-slate-800 text-lg">Suki Accounts</h3>
                    <div className="bg-slate-200 p-1.5 rounded-lg cursor-pointer hover:bg-slate-300 transition">
                        <Icon name="filter" className="w-4 h-4 text-slate-600" />
                    </div>
                </div>
                
                <div className="space-y-3.5">
                    {[
                        { name: 'Aling Nena', balance: '₱ 1,200.00', lastActive: '2 days ago', color: 'bg-emerald-100 text-emerald-700' },
                        { name: 'Mang Juan', balance: '₱ 850.00', lastActive: 'Yesterday', color: 'bg-amber-100 text-amber-700' },
                        { name: 'Kuya Pedro', balance: '₱ 1,400.00', lastActive: 'Today', color: 'bg-blue-100 text-blue-700' },
                    ].map((suki, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-emerald-100 transition active:scale-[0.98]">
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-2xl ${suki.color} flex items-center justify-center font-bold text-lg`}>
                                    {suki.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{suki.name}</h4>
                                    <p className="text-xs font-medium text-slate-400 mt-0.5">Last active: {suki.lastActive}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-red-500">{suki.balance}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderView = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'inventory': return <Inventory />;
            case 'ledger': return <SukiLedger />;
            default: return <Dashboard />;
        }
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'dashboard': return 'Overview';
            case 'inventory': return 'Inventory';
            case 'ledger': return 'Suki Ledger';
            default: return 'App';
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 relative">
            <Header title={getTitle()} />
            
            {/* Scrollable Content Area */}
            {renderView()}

            {/* Floating Bottom Navigation */}
            <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 px-6 py-3.5 flex justify-between items-center">
                    
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex flex-col items-center space-y-1.5 transition-all duration-300 w-16 ${activeTab === 'dashboard' ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="relative">
                            <Icon name="layout-dashboard" className={`w-6 h-6 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                            {activeTab === 'dashboard' && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"></div>}
                        </div>
                        <span className={`text-[10px] tracking-wide ${activeTab === 'dashboard' ? 'font-bold' : 'font-medium'}`}>Home</span>
                    </button>

                    <button 
                        onClick={() => setActiveTab('inventory')}
                        className={`flex flex-col items-center space-y-1.5 transition-all duration-300 w-16 ${activeTab === 'inventory' ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="relative">
                            <Icon name="package" className={`w-6 h-6 ${activeTab === 'inventory' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                            {activeTab === 'inventory' && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"></div>}
                        </div>
                        <span className={`text-[10px] tracking-wide ${activeTab === 'inventory' ? 'font-bold' : 'font-medium'}`}>Stock</span>
                    </button>

                    <button 
                        onClick={() => setActiveTab('ledger')}
                        className={`flex flex-col items-center space-y-1.5 transition-all duration-300 w-16 ${activeTab === 'ledger' ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="relative">
                            <Icon name="book-user" className={`w-6 h-6 ${activeTab === 'ledger' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                            {activeTab === 'ledger' && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"></div>}
                        </div>
                        <span className={`text-[10px] tracking-wide ${activeTab === 'ledger' ? 'font-bold' : 'font-medium'}`}>Ledger</span>
                    </button>

                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
