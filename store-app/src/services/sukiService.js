// src/services/sukiService.js
import { supabase } from '../lib/supabaseClient';
import { deductInventoryStock } from './inventoryService';

/**
 * Charge cart items to an existing suki's ledger.
 */
export const chargeToSuki = async ({ suki, cart, setSukiList, setTodayStats, inventory, setInventory }) => {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const costTotal = cart.reduce((s, i) => s + ((i.cost || i.price * 0.8) * i.qty), 0);
  const cartDesc = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStrForMsg = now.toLocaleDateString();
  const dateStrForHistory = now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // 1. Optimistic UI Updates
  const newHistoryItem = { id: Date.now(), desc: cartDesc, date: dateStrForHistory, amt: total };
  setSukiList(prev => prev.map(s =>
    s.id !== suki.id ? s : {
      ...s,
      balance: s.balance + total,
      lastActive: 'Just now',
      history: [newHistoryItem, ...s.history],
    }
  ));

  setTodayStats(prev => ({
    ...prev,
    credit: prev.credit + total,
    profit: prev.profit + (total - costTotal),
    transactions: [{ id: Date.now(), name: cartDesc, time: timeStr, amount: total, type: 'credit' }, ...(prev.transactions || [])]
  }));

  if (cart && cart.length > 0 && inventory && setInventory) {
    deductInventoryStock({ cart, inventory, setInventory });
  }

  // 2. DB Updates
  // Update suki_accounts balance
  await supabase.from('suki_accounts').update({ 
    balance: suki.balance + total, 
    last_active: 'Just now' 
  }).eq('id', suki.id);

  // Insert suki_history
  await supabase.from('suki_history').insert([{
    suki_id: suki.id,
    description: cartDesc,
    amount: total
  }]);

  return { total, cartDesc, dateStrForMsg, timeStr };
};

/**
 * Create a new suki profile and charge the cart to them immediately.
 */
export const chargeToNewSuki = async ({ name, phone, cart, setSukiList, setTodayStats, inventory, setInventory }) => {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const costTotal = cart.reduce((s, i) => s + ((i.cost || i.price * 0.8) * i.qty), 0);
  const cartDesc = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStrForMsg = now.toLocaleDateString();
  const dateStrForHistory = now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // 1. Insert to DB First to get ID
  const { data: sukiData, error: sukiError } = await supabase.from('suki_accounts').insert([{
    name,
    phone,
    balance: total,
    initial: name.charAt(0).toUpperCase(),
    bg: 'bg-emerald-100 text-emerald-700',
    last_active: 'Just now'
  }]).select();

  if (sukiError || !sukiData || sukiData.length === 0) return null;
  const newSukiDb = sukiData[0];

  // Insert suki_history
  const { data: historyData } = await supabase.from('suki_history').insert([{
    suki_id: newSukiDb.id,
    description: cartDesc,
    amount: total
  }]).select();

  const newHistoryItem = { 
    id: historyData ? historyData[0].id : Date.now(), 
    desc: cartDesc, 
    date: dateStrForHistory, 
    amt: total 
  };

  const newSuki = {
    ...newSukiDb,
    balance: parseFloat(newSukiDb.balance),
    history: [newHistoryItem]
  };

  // 2. UI Update
  setSukiList(prev => [newSuki, ...prev]);
  setTodayStats(prev => ({
    ...prev,
    credit: prev.credit + total,
    profit: prev.profit + (total - costTotal),
    transactions: [{ id: Date.now(), name: cartDesc, time: timeStr, amount: total, type: 'credit' }, ...(prev.transactions || [])]
  }));

  if (cart && cart.length > 0 && inventory && setInventory) {
    deductInventoryStock({ cart, inventory, setInventory });
  }

  return { total, cartDesc, dateStrForMsg, timeStr, newSuki };
};

/**
 * Record a full or partial payment from a suki.
 */
export const recordSukiPayment = async ({ sukiId, amount, setSukiList }) => {
  const dateStrForHistory = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  // Fetch current balance first to ensure correctness, or rely on UI state for now
  // For safety, we will just rely on the UI state passed in from the component 
  // but let's do optimistic first.

  let currentSuki;
  setSukiList(prev => prev.map(s => {
    if (s.id !== sukiId) return s;
    currentSuki = s;
    return {
      ...s,
      balance: Math.max(0, s.balance - amount),
      lastActive: 'Just now',
      history: [
        { id: Date.now(), desc: `Payment Received — ₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, date: dateStrForHistory, amt: -amount, isPayment: true },
        ...s.history,
      ],
    };
  }));

  if (!currentSuki) return;

  // DB Updates
  await supabase.from('suki_accounts').update({ 
    balance: Math.max(0, currentSuki.balance - amount), 
    last_active: 'Just now' 
  }).eq('id', sukiId);

  await supabase.from('suki_history').insert([{
    suki_id: sukiId,
    description: `Payment Received`,
    amount: -amount
  }]);
};

/**
 * Record a manual ledger entry (without a POS cart).
 */
export const recordManualLedger = async ({ isNewSuki, selectedSukiId, newSukiName, newSukiPhone, itemsUtang, totalAmount, sukiList, setSukiList }) => {
  const dateStrForHistory = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (isNewSuki) {
    // 1. Insert to DB
    const { data: sukiData } = await supabase.from('suki_accounts').insert([{
      name: newSukiName,
      phone: newSukiPhone,
      balance: totalAmount,
      initial: newSukiName.charAt(0).toUpperCase(),
      bg: 'bg-emerald-100 text-emerald-700',
      last_active: 'Just now'
    }]).select();

    const newSukiDb = sukiData[0];

    const { data: historyData } = await supabase.from('suki_history').insert([{
      suki_id: newSukiDb.id,
      description: itemsUtang,
      amount: totalAmount
    }]).select();

    const newSuki = {
      ...newSukiDb,
      balance: parseFloat(newSukiDb.balance),
      history: [{
        id: historyData[0].id,
        desc: itemsUtang,
        date: dateStrForHistory,
        amt: totalAmount
      }]
    };
    
    setSukiList(prev => [newSuki, ...prev]);

  } else {
    // Existing suki optimistic update
    const currentSuki = sukiList.find(s => s.id === selectedSukiId);
    if(!currentSuki) return;

    setSukiList(prev => prev.map(s =>
      s.id !== selectedSukiId ? s : {
        ...s,
        balance: s.balance + totalAmount,
        lastActive: 'Just now',
        history: [{ id: Date.now(), desc: itemsUtang, date: dateStrForHistory, amt: totalAmount }, ...s.history]
      }
    ));

    // DB Update
    await supabase.from('suki_accounts').update({ 
      balance: currentSuki.balance + totalAmount, 
      last_active: 'Just now' 
    }).eq('id', selectedSukiId);

    await supabase.from('suki_history').insert([{
      suki_id: selectedSukiId,
      description: itemsUtang,
      amount: totalAmount
    }]);
  }
};
