// src/hooks/useSupabaseData.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ITEM_CATEGORIES } from '../services/inventoryService';

export function useSupabaseData(setInventory, setSukiList, setShiftHistory) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Inventory
        const { data: invData } = await supabase.from('inventory').select('*').order('name');
        if (invData) {
          const mappedInv = invData.map(item => {
            const cat = ITEM_CATEGORIES[item.category_index] || ITEM_CATEGORIES[0];
            return { ...item, icon: cat.icon, color: cat.color };
          });
          setInventory(mappedInv);
        }

        // 2. Fetch Suki Accounts with their History
        const { data: sukiData } = await supabase.from('suki_accounts').select('*').order('name');
        const { data: historyData } = await supabase.from('suki_history').select('*').order('created_at', { ascending: false });
        
        if (sukiData && historyData) {
          const mappedSuki = sukiData.map(suki => {
            const sukiHist = historyData.filter(h => h.suki_id === suki.id).map(h => ({
              id: h.id,
              desc: h.description,
              amt: parseFloat(h.amount),
              date: new Date(h.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
              isPayment: parseFloat(h.amount) < 0
            }));
            return {
              ...suki,
              balance: parseFloat(suki.balance),
              history: sukiHist
            };
          });
          setSukiList(mappedSuki);
        }

        // 3. Fetch Shift History
        const { data: shiftsData } = await supabase.from('shift_history').select('*').order('created_at', { ascending: true });
        const { data: transData } = await supabase.from('shift_transactions').select('*');
        
        if (shiftsData && transData) {
          const mappedShifts = shiftsData.map(shift => {
            const txns = transData.filter(t => t.shift_id === shift.id).map(t => ({
              id: t.id,
              desc: t.description,
              total: parseFloat(t.total),
              type: t.type
            }));
            return {
              id: shift.id,
              date: shift.date,
              cash: parseFloat(shift.cash),
              credit: parseFloat(shift.credit),
              profit: parseFloat(shift.profit),
              startingCash: parseFloat(shift.starting_cash),
              transactions: txns
            };
          });
          setShiftHistory(mappedShifts);
        }

      } catch (err) {
        console.error("Error fetching initial data from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { loading };
}
