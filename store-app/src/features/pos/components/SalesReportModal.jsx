// src/features/pos/components/SalesReportModal.jsx
import React, { useState } from 'react';
import { X, Share2, ChevronRight, CheckCircle, BookOpen } from 'lucide-react';
import { closeShift, buildShareReportText } from '../../../services/statsService';

export default function SalesReportModal({ todayStats, setTodayStats, shiftHistory, setShiftHistory, onClose, onSuccessToast }) {
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [expandedShifts, setExpandedShifts] = useState({});
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  const [isEditingStartingCash, setIsEditingStartingCash] = useState(false);
  const [startingCashInput, setStartingCashInput] = useState('');

  const handleCloseShift = () => {
    closeShift({ todayStats, setTodayStats, setShiftHistory });
    setIsConfirmingClose(false);
    onClose();
    onSuccessToast({ msg: 'Day shift closed successfully. Sales history archived.', sms: '' });
  };

  const handleShareReport = () => {
    const smsText = buildShareReportText(todayStats);
    onSuccessToast({ msg: 'Sales Report is ready to be shared!', sms: smsText, phone: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 h-[75vh] flex flex-col relative">
        <div className="bg-emerald-600 px-6 py-6 pb-12 flex justify-between items-start text-white shrink-0 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500 rounded-full opacity-50 blur-2xl" />
          <div>
            <h3 className="font-extrabold text-xl">{showHistoryView ? 'Sales History' : 'Daily Sales Report'}</h3>
            {!showHistoryView && <p className="text-emerald-100 text-xs mt-1 font-medium">As of Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
          </div>
          <div className="flex gap-2 z-10">
            {!showHistoryView && (
              <button onClick={handleShareReport} className="bg-emerald-500/30 p-2 rounded-full hover:bg-emerald-500/50 transition" title="Share Report">
                <Share2 size={16} />
              </button>
            )}
            <button onClick={() => setShowHistoryView(!showHistoryView)} className="bg-emerald-500/30 px-3 py-1.5 rounded-full hover:bg-emerald-500/50 transition text-xs font-bold">
              {showHistoryView ? 'Back to Today' : 'History'}
            </button>
            <button onClick={onClose} className="bg-emerald-500/30 p-2 rounded-full hover:bg-emerald-500/50 transition">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 flex-1 overflow-y-auto -mt-6 z-10 relative">
          {showHistoryView ? (
            <div className="flex flex-col gap-4 pt-4">
              {shiftHistory.length === 0 ? (
                <p className="text-center text-slate-400 text-sm mt-10 font-medium">No sales history found.</p>
              ) : (
                shiftHistory.map(shift => (
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
                    <div className="mt-1 border-t border-slate-100 pt-3">
                      <button
                        onClick={() => setExpandedShifts(prev => ({ ...prev, [shift.id]: !prev[shift.id] }))}
                        className="w-full text-xs font-bold text-slate-500 hover:text-emerald-600 transition flex items-center justify-center gap-1.5 py-1"
                      >
                        {expandedShifts[shift.id] ? 'Hide Transactions' : 'View Transactions List'}
                        <ChevronRight size={14} className={`transition-transform duration-200 ${expandedShifts[shift.id] ? 'rotate-90' : ''}`} />
                      </button>
                      {expandedShifts[shift.id] && (
                        <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-200 border-dashed font-mono text-xs">
                          {(!shift.transactions || shift.transactions.length === 0) ? (
                            <p className="text-center text-slate-400 py-2 font-sans">No detailed transactions saved.</p>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {shift.transactions.map(tx => (
                                <div key={tx.id} className="flex justify-between items-start gap-3 border-b border-slate-200/60 last:border-0 pb-2 last:pb-0">
                                  <div className="flex-1 pr-2">
                                    <p className="font-semibold text-slate-700 leading-snug">{tx.desc}</p>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${tx.type.includes('Utang') ? 'text-orange-500' : 'text-blue-500'}`}>{tx.type}</span>
                                  </div>
                                  <span className="font-black text-slate-800 whitespace-nowrap text-sm">₱{tx.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 mb-4 flex flex-col items-center mt-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Sales Generated</p>
                <p className="text-4xl font-black text-emerald-600">₱{(todayStats.cash + todayStats.credit).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl mb-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl" />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
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
                          type="number" autoFocus value={startingCashInput}
                          onChange={e => setStartingCashInput(e.target.value)}
                          onBlur={() => { setTodayStats(prev => ({ ...prev, startingCash: parseFloat(startingCashInput) || 0 })); setIsEditingStartingCash(false); }}
                          onKeyDown={e => { if (e.key === 'Enter') { setTodayStats(prev => ({ ...prev, startingCash: parseFloat(startingCashInput) || 0 })); setIsEditingStartingCash(false); } }}
                          className="w-20 px-1.5 py-0.5 text-right rounded border border-blue-300 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    ) : (
                      <span onClick={() => { setStartingCashInput(todayStats.startingCash.toString()); setIsEditingStartingCash(true); }} className="font-bold border-b border-dashed border-blue-400 cursor-pointer hover:text-blue-900 transition" title="Tap to edit">
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

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex flex-col justify-center">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-2"><BookOpen size={16} /></div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Debts Logged</p>
                  <p className="text-lg font-black text-slate-700">₱{todayStats.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-100 rounded-full opacity-50 blur-xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 relative z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-0.5">Est. Ginansya</p>
                    <p className="text-lg font-black text-emerald-700">₱{todayStats.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-6">
                {!isConfirmingClose ? (
                  <button onClick={() => setIsConfirmingClose(true)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-3.5 rounded-xl transition text-sm flex justify-center items-center gap-2">
                    <CheckCircle size={18} /> Close Shop / Reset Day
                  </button>
                ) : (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl animate-in zoom-in-95 duration-200">
                    <p className="text-sm font-bold text-red-700 text-center mb-3">Sigurado ka nga i-close ang shift karong adlawa? Gi-save na kini sa imong History.</p>
                    <div className="flex gap-2">
                      <button onClick={() => setIsConfirmingClose(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl transition text-sm shadow-sm">Cancel</button>
                      <button onClick={handleCloseShift} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm shadow-red-500/30">Yes, Close Shift</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
