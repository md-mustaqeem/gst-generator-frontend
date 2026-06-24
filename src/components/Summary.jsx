import { ReceiptText } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function Summary({
  subtotal,
  discountAmount,
  gstAmount,
  grandTotal,
  paidAmount,
  setPaidAmount,
  dueAmount,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <ReceiptText size={20} className="text-blue-600" />
        </div>

        <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
      </div>

      <div className="space-y-4">
        {/* Charges */}
        <div className="space-y-3">
          <div className="flex justify-between text-slate-700">
            <span>Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span>Discount</span>
            <span>- {formatCurrency(discountAmount)}</span>
          </div>

          <div className="flex justify-between text-slate-700">
            <span>GST</span>
            <span className="font-medium">{formatCurrency(gstAmount)}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg border-t pt-3">
            <span>Total Amount</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-2" />

        {/* Paid */}
        <div className="flex items-center justify-between">
          <label className="font-medium text-emerald-700">Paid Amount</label>

          <input
            type="number"
            min="0"
            max={grandTotal}
            value={paidAmount === 0 ? "" : paidAmount}
            placeholder="Enter amount"
            onChange={(e) =>
              setPaidAmount(Math.min(Number(e.target.value || 0), grandTotal))
            }
            className="paid-input w-48 h-11 border rounded-lg px-3 text-right outline-none focus:border-emerald-500"
          />
        </div>

        {/* Due */}

        <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
          <span className="text-lg font-semibold text-orange-700">
            Due Amount
          </span>

          <span className="text-2xl font-bold text-orange-700">
            {formatCurrency(dueAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
