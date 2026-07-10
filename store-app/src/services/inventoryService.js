// src/services/inventoryService.js
import { Package, Coffee, Droplet, Utensils, Smartphone } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const ITEM_CATEGORIES = [
  { label: 'General',  icon: Package,    color: 'bg-emerald-50 text-emerald-500' },
  { label: 'Kape',     icon: Coffee,     color: 'bg-orange-50 text-orange-500'  },
  { label: 'Bugnaw',   icon: Droplet,    color: 'bg-blue-50 text-blue-500'      },
  { label: 'Pagkaon',  icon: Utensils,   color: 'bg-red-50 text-red-500'        },
  { label: 'Load',     icon: Smartphone, color: 'bg-indigo-50 text-indigo-500'  },
];

/**
 * Fetch all inventory items from Supabase and map them to UI categories.
 */
export const fetchInventory = async (setInventory) => {
  const { data, error } = await supabase.from('inventory').select('*').order('name');
  if (error) {
    console.error('Error fetching inventory:', error);
    return;
  }
  
  const mappedData = data.map(item => {
    const cat = ITEM_CATEGORIES[item.category_index] || ITEM_CATEGORIES[0];
    return {
      ...item,
      icon: cat.icon,
      color: cat.color
    };
  });
  setInventory(mappedData);
};

/**
 * Add a new item to inventory.
 */
export const addInventoryItem = async ({ newItem, inventory, setInventory }) => {
  const { data, error } = await supabase
    .from('inventory')
    .insert([{
      name: newItem.name,
      price: parseFloat(newItem.price),
      cost: parseFloat(newItem.cost),
      qty: parseInt(newItem.stock, 10),
      min: 5,
      category_index: newItem.categoryIndex
    }])
    .select();

  if (error) {
    console.error('Error adding inventory item:', error);
    return null;
  }

  const inserted = data[0];
  const cat = ITEM_CATEGORIES[inserted.category_index] || ITEM_CATEGORIES[0];
  
  const product = {
    ...inserted,
    icon: cat.icon,
    color: cat.color,
  };
  
  setInventory([...inventory, product]);
  return product;
};

/**
 * Update an existing inventory item.
 */
export const updateInventoryItem = async ({ id, updates, setInventory }) => {
  // Optimistic UI update
  setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));

  // Sync to database
  const { error } = await supabase
    .from('inventory')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating inventory item:', error);
    // In a real app, we might rollback the UI state here if the DB fails
  }
};

/**
 * Delete an inventory item.
 */
export const deleteInventoryItem = async ({ id, setInventory }) => {
  setInventory(prev => prev.filter(item => item.id !== id));
  
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting inventory item:', error);
  }
};
