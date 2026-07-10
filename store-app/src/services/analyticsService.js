// src/services/analyticsService.js

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function buildMonthlyData(shiftHistory) {
  const map = {};
  shiftHistory.forEach(shift => {
    const d = new Date(shift.date);
    if (isNaN(d)) return;
    const key = d.getFullYear() + "-" + d.getMonth();
    if (!map[key]) map[key] = { label: MONTHS[d.getMonth()] + " " + d.getFullYear(), cash: 0, credit: 0, profit: 0 };
    map[key].cash += shift.cash || 0;
    map[key].credit += shift.credit || 0;
    map[key].profit += shift.profit || 0;
  });
  return Object.values(map).slice(-6);
}

export function buildTopProducts(inventory) {
  return [...inventory]
    .map(item => ({
      name: item.name,
      sold: item.min * 2 + Math.floor(item.qty / 2),
      price: item.price,
      profit: item.price - item.cost,
      color: item.color
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);
}

export function calculateAggregates({ shiftHistory, todayStats, sukiList }) {
  const totalCash = shiftHistory.reduce((s, h) => s + (h.cash || 0), 0) + (todayStats.cash || 0);
  const totalCredit = shiftHistory.reduce((s, h) => s + (h.credit || 0), 0) + (todayStats.credit || 0);
  const totalProfit = shiftHistory.reduce((s, h) => s + (h.profit || 0), 0) + (todayStats.profit || 0);
  const totalSales = totalCash + totalCredit;
  const totalDebt = sukiList.reduce((s, sk) => s + sk.balance, 0);

  return { totalCash, totalCredit, totalProfit, totalSales, totalDebt };
}
