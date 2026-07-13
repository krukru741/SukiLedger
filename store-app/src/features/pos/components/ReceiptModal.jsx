// src/features/pos/components/ReceiptModal.jsx
import React, { useRef } from 'react';
import { Printer, X, Check } from 'lucide-react';

export default function ReceiptModal({ receiptData, onClose }) {
  const receiptRef = useRef(null);

  if (!receiptData) return null;

  const { cart, total, received, change, storeName, timestamp } = receiptData;

  const handlePrint = () => {
    const printContent = receiptRef.current.innerHTML;
    const printWindow = window.open('', '_blank', 'width=320,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${storeName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 13px;
              width: 280px;
              padding: 12px;
              color: #000;
            }
            .receipt-header { text-align: center; margin-bottom: 10px; }
            .receipt-header h1 { font-size: 18px; font-weight: bold; }
            .receipt-header p { font-size: 11px; color: #555; margin-top: 2px; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .item-row { display: flex; justify-content: space-between; margin: 3px 0; font-size: 12px; }
            .item-name { flex: 1; }
            .item-qty { width: 30px; text-align: center; }
            .item-price { width: 70px; text-align: right; }
            .totals { margin-top: 4px; }
            .total-row { display: flex; justify-content: space-between; margin: 3px 0; }
            .total-row.grand { font-weight: bold; font-size: 15px; margin-top: 6px; }
            .footer { text-align: center; margin-top: 12px; font-size: 11px; color: #555; }
            @media print {
              body { width: 100%; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm modal-backdrop">
      <div className="bg-white rounded-[2rem] w-full max-w-xs overflow-hidden shadow-2xl animate-scale-in">

        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Printer size={18} />
            <h3 className="font-bold">Receipt</h3>
          </div>
          <button onClick={onClose} className="bg-emerald-500/30 p-1.5 rounded-full hover:bg-emerald-500/50">
            <X size={18} />
          </button>
        </div>

        {/* Receipt Preview */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          <div
            ref={receiptRef}
            className="font-mono text-[12px] text-slate-800 leading-relaxed"
          >
            {/* Receipt content that will be printed */}
            <div className="receipt-header text-center mb-3">
              <h1 className="text-base font-black uppercase tracking-wide">{storeName || 'SukiLedger'}</h1>
              <p className="text-[10px] text-slate-500 mt-0.5">{timestamp}</p>
            </div>

            <div className="divider border-t border-dashed border-slate-300 my-3" />

            {/* Items */}
            <div className="flex flex-col gap-1">
              <div className="flex text-[10px] font-bold text-slate-400 uppercase mb-1">
                <span className="flex-1">Item</span>
                <span className="w-8 text-center">Qty</span>
                <span className="w-20 text-right">Amount</span>
              </div>
              {cart.map((item, i) => (
                <div key={i} className="item-row flex">
                  <span className="item-name flex-1 truncate">{item.name}</span>
                  <span className="item-qty w-8 text-center">{item.qty}</span>
                  <span className="item-price w-20 text-right">₱{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="divider border-t border-dashed border-slate-300 my-3" />

            {/* Totals */}
            <div className="totals flex flex-col gap-1">
              <div className="total-row flex justify-between text-[11px]">
                <span className="text-slate-500">Subtotal</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div className="total-row flex justify-between text-[11px]">
                <span className="text-slate-500">Cash Received</span>
                <span>₱{received.toFixed(2)}</span>
              </div>
              <div className="total-row grand flex justify-between font-black text-sm border-t border-slate-200 pt-2 mt-1">
                <span>SUKLI (Change)</span>
                <span className="text-emerald-600">₱{change.toFixed(2)}</span>
              </div>
            </div>

            <div className="divider border-t border-dashed border-slate-300 my-3" />

            <div className="footer text-center text-[10px] text-slate-400 mt-2">
              <p>Salamat sa inyong pagbili!</p>
              <p className="mt-0.5">Powered by SukiLedger 🏪</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="px-5 pb-5 flex flex-col gap-2">
          <button
            onClick={handlePrint}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <Printer size={18} />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Check size={16} />
            Done, Skip Print
          </button>
        </div>
      </div>
    </div>
  );
}
