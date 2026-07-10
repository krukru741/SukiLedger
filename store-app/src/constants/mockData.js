// src/constants/mockData.js
// ─────────────────────────────────────────────────────────────────────────────
// All seed/mock data is centralized here.
// When connecting to Supabase, replace these with API calls in src/services/
// ─────────────────────────────────────────────────────────────────────────────
import { Utensils, Coffee, ShoppingBag, Droplet, Package, Smartphone } from 'lucide-react';

export const INITIAL_SUKI_LIST = [
  {
    id: 1, name: 'Aling Nena', balance: 1200, phone: '09123456789',
    lastActive: '2 days ago', initial: 'A', bg: 'bg-emerald-100 text-emerald-700',
    history: [
      { desc: '5kg Rice, 1L Oil',       date: 'Oct 24, 2023, 09:15 AM', amt: 450 },
      { desc: 'Canned Goods, Bread',    date: 'Oct 22, 2023, 02:30 PM', amt: 350 },
      { desc: 'Detergent, Load',        date: 'Oct 18, 2023, 06:45 AM', amt: 400 },
    ],
  },
  { id: 2, name: 'Mang Juan',  balance: 850,  phone: '09876543210', lastActive: 'Yesterday',   initial: 'M', bg: 'bg-amber-100 text-amber-700',   history: [] },
  { id: 3, name: 'Kuya Pedro', balance: 1400, phone: '09112223333', lastActive: 'Today',        initial: 'K', bg: 'bg-blue-100 text-blue-700',     history: [] },
  { id: 4, name: 'Ate Susan',  balance: 450,  phone: '09998887777', lastActive: '1 week ago',   initial: 'A', bg: 'bg-purple-100 text-purple-700', history: [] },
];

export const INITIAL_INVENTORY = [
  { id: 1, name: 'Coca-Cola 1.5L',    price: 75.00, cost: 65.00, qty: 12,  min: 10, icon: Utensils,    color: 'bg-red-50 text-red-500'    },
  { id: 2, name: 'Pancit Canton',     price: 15.00, cost: 12.00, qty: 3,   min: 5,  icon: Package,     color: 'bg-orange-50 text-orange-500' },
  { id: 3, name: 'Marlboro Red',      price: 100.00,cost: 90.00, qty: 8,   min: 10, icon: Package,     color: 'bg-red-50 text-red-700'    },
  { id: 4, name: 'Great Taste White', price: 12.00, cost: 9.00,  qty: 20,  min: 15, icon: Coffee,      color: 'bg-orange-50 text-orange-600' },
  { id: 5, name: 'Bear Brand 150g',   price: 55.00, cost: 48.00, qty: 24,  min: 10, icon: Coffee,      color: 'bg-yellow-50 text-yellow-600' },
  { id: 6, name: 'Kopiko Brown',      price: 12.00, cost: 9.00,  qty: 45,  min: 20, icon: Coffee,      color: 'bg-amber-50 text-amber-700'  },
  { id: 7, name: 'Repacked Sugar',    price: 20.00, cost: 15.00, qty: 15,  min: 10, icon: ShoppingBag, color: 'bg-slate-100 text-slate-500' },
  { id: 8, name: 'Ice Tubig',         price: 3.00,  cost: 1.00,  qty: 100, min: 50, icon: Droplet,     color: 'bg-cyan-50 text-cyan-500'   },
];

export const INITIAL_STATS = {
  cash: 0,
  credit: 0,
  profit: 0,
  startingCash: 500.00,
  transactions: []
};

export const INITIAL_SHIFT_HISTORY = [
  {
    id: 1, date: 'Oct 24, 2023', cash: 1200, credit: 350, profit: 320, startingCash: 500,
    transactions: [
      { id: 't1', desc: '10x Pancit Canton, 2x Coca-Cola 1.5L', total: 300, type: 'Cash' },
      { id: 't2', desc: '3x Marlboro Red',                       total: 300, type: 'Utang - Mang Juan' },
      { id: 't3', desc: 'Rice 5kg, Canned Goods',                total: 950, type: 'Cash' },
    ],
  },
  {
    id: 2, date: 'Oct 23, 2023', cash: 950, credit: 200, profit: 210, startingCash: 500,
    transactions: [
      { id: 't4', desc: 'Bear Brand 150g, Bread',       total: 110, type: 'Cash' },
      { id: 't5', desc: '2x Kopiko Brown, Sugar',       total: 44,  type: 'Utang - Aling Nena' },
      { id: 't6', desc: 'Assorted Groceries',           total: 840, type: 'Cash' },
      { id: 't7', desc: 'Pancit Canton x10',            total: 156, type: 'Utang - Mang Juan' },
    ],
  },
];

export const INITIAL_SETTINGS = {
  storeName: 'SukiLedger Tindahan',
  ownerName: '',
  ownerPhone: '',
  logo: '',
  startingCash: 500,
  smsTemplate: 'Maayong adlaw, {name}! Reminder lang gikan sa {storeName} bahin sa imong kasamtangang utang ledger nga nagkantidad og {balance}. Pwede ra nimo ma-settle sa tindahan kung hayahay na ka. Salamat kaayo!',
};

export const RECENT_TRANSACTIONS_MOCK = [
  { id: 1, name: '2x Coca-Cola 1.5L',   time: '10:42 AM',             amount: 150.00, icon: ShoppingBag, bg: 'bg-blue-50 text-blue-500',    date: 'Today' },
  { id: 2, name: '1x Load Globe 50',    time: '09:15 AM',             amount: 53.00,  icon: Smartphone,  bg: 'bg-indigo-50 text-indigo-500', date: 'Today' },
  { id: 3, name: 'Bread, Eggs, Milk',   time: 'Yesterday, 08:30 AM',  amount: 210.00, icon: Utensils,    bg: 'bg-amber-50 text-amber-500',   date: 'Yesterday' },
  { id: 4, name: 'Pancit Canton x4',    time: 'Monday, 07:45 AM',     amount: 60.00,  icon: ShoppingBag, bg: 'bg-orange-50 text-orange-500', date: 'This Week' },
  { id: 5, name: 'Smart Load 50',       time: 'Last Oct 12, 02:15 PM',amount: 53.00,  icon: Smartphone,  bg: 'bg-green-50 text-green-500',   date: 'Last Week' },
  { id: 6, name: '1x Bear Brand 150g',  time: 'Oct 02, 10:00 AM',     amount: 55.00,  icon: Coffee,      bg: 'bg-yellow-50 text-yellow-600', date: 'This Month' },
  { id: 7, name: '1x Safeguard White',  time: 'Sep 15, 09:30 AM',     amount: 35.00,  icon: ShoppingBag, bg: 'bg-slate-50 text-slate-500',   date: 'Last Month' },
];
