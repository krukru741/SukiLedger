// src/services/statsService.js
import { supabase } from '../lib/supabaseClient';
import { deductInventoryStock } from './inventoryService';

/**
 * Record a cash payment sale.
 * We update the local state for today's running shift.
 */
export const confirmCashPayment = ({ cart, cashReceived, todayStats, setTodayStats, inventory, setInventory }) => {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const received = parseFloat(cashReceived) || total;
  const change = received - total;
  const costTotal = cart.reduce((s, i) => s + ((i.cost || i.price * 0.8) * i.qty), 0);

  setTodayStats(prev => ({
    ...prev,
    cash: prev.cash + total,
    profit: prev.profit + (total - costTotal),
    transactions: [{ id: Date.now(), name: cart.map(i=>`${i.qty}x ${i.name}`).join(', '), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), amount: total, type: 'cash' }, ...(prev.transactions || [])]
  }));

  // Deduct from inventory
  if (cart && cart.length > 0 && inventory && setInventory) {
    deductInventoryStock({ cart, inventory, setInventory });
  }

  // We could record a transaction here if we had an ongoing "active" shift in the DB,
  // but for simplicity we just aggregate in local state and save on closeShift.

  return { total, change };
};

/**
 * Close the current day shift and archive to history.
 */
export const closeShift = async ({ todayStats, setTodayStats, setShiftHistory }) => {
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const newShift = {
    date: dateStr,
    cash: todayStats.cash,
    credit: todayStats.credit,
    profit: todayStats.profit,
    starting_cash: todayStats.startingCash
  };

  // Optimistic UI Update
  setShiftHistory(prev => [
    {
      id: Date.now(),
      date: dateStr,
      cash: todayStats.cash,
      credit: todayStats.credit,
      profit: todayStats.profit,
      startingCash: todayStats.startingCash,
      transactions: [],
    },
    ...prev,
  ]);

  setTodayStats(prev => ({ ...prev, cash: 0, credit: 0, profit: 0 }));

  // Push to Supabase
  const { error } = await supabase.from('shift_history').insert([newShift]);
  if (error) {
    console.error("Error saving shift history:", error);
  }
};

/**
 * Build the share-report SMS text.
 */
export const buildShareReportText = (todayStats) => {
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const total = todayStats.cash + todayStats.credit;
  return `SukiLedger Report (${dateStr}):\nTotal Sales: ₱${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}\nCash: ₱${todayStats.cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}\nUtang Logged: ₱${todayStats.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}\nEst. Ginansya: ₱${todayStats.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
};
