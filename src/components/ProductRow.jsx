import { Trash2 } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function ProductRow({ item, index, onChange, onDelete }) {
  const qty = Number(item.qty) || 0;
  const price = Number(item.price) || 0;
  const gst = Number(item.gst) || 0;
  const discount = Number(item.discount) || 0;

  const subtotal = qty * price;
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = (taxableAmount * gst) / 100;
  const total = taxableAmount + gstAmount;

  const errors = {
    product: (item.product || "").trim() === "",
    qty: (item.qty ?? "") === "" || qty < 1,
    price: (item.price ?? "") === "" || price < 0,
    discount: discount < 0 || discount > 100,
  };

  return (
    <>
      {index === 0 && (
        <div className="grid grid-cols-14 gap-3 mb-2 text-[11px] font-semibold uppercase text-slate-500">
          <div className="col-span-3">Product</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Discount %</div>
          <div className="col-span-2 text-center">GST %</div>
          <div className="col-span-2 text-center">Total</div>
        </div>
      )}

      <div className="grid grid-cols-14 gap-3 items-start">
        {/* Product */}
        <div className="col-span-3">
          <input
            type="text"
            placeholder="Item Name"
            value={item.product || ""}
            onChange={(e) => onChange(index, "product", e.target.value)}
            className={`no-spinner w-full h-9 rounded-lg px-3 border outline-none transition ${
              errors.product
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }`}
          />

          {errors.product && (
            <p className="text-[10px] text-red-500 mt-1">Required</p>
          )}
        </div>

        {/* Qty */}
        <div className="col-span-2">
          <input
            type="number"
            min="1"
            placeholder=""
            value={item.qty ?? ""}
            onChange={(e) => onChange(index, "qty", e.target.value)}
            className={`no-spinner w-full h-9 rounded-lg px-3 border outline-none ${
              errors.qty
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }`}
          />

          {errors.qty && (
            <p className="text-[10px] text-red-500 mt-1">Invalid</p>
          )}
        </div>

        {/* Price */}
        <div className="col-span-2">
          <input
            type="number"
            min="0"
            placeholder=""
            value={item.price ?? ""}
            onChange={(e) => onChange(index, "price", e.target.value)}
            className={`no-spinner w-full h-9 rounded-lg px-3 border outline-none ${
              errors.price
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }`}
          />

          {errors.price && (
            <p className="text-[10px] text-red-500 mt-1">Invalid</p>
          )}
        </div>

        {/* Discount */}
        <div className="col-span-2">
          <input
            type="number"
            min="0"
            max="100"
            placeholder=""
            value={item.discount ?? ""}
            onChange={(e) => onChange(index, "discount", e.target.value)}
            className={`no-spinner w-full h-9 rounded-lg px-3 border outline-none ${
              errors.discount
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }`}
          />

          {errors.discount && (
            <p className="text-[10px] text-red-500 mt-1">0-100%</p>
          )}
        </div>

        {/* GST */}
        <div className="col-span-2">
          <select
            value={item.gst ?? ""}
            onChange={(e) => onChange(index, "gst", Number(e.target.value))}
            className="w-full h-9 rounded-lg border border-slate-300 px-2 outline-none focus:border-blue-500"
          >
            {[0, 5, 12, 18, 28].map((g) => (
              <option key={g} value={g}>
                {g}%
              </option>
            ))}
          </select>
        </div>

        {/* Total */}
        <div className="col-span-3 flex items-center justify-between h-9">
          <span className="font-semibold text-sm whitespace-nowrap">
            {formatCurrency(total)}
          </span>

          <button
            type="button"
            onClick={() => onDelete(index)}
            disabled={index === 0}
            className="ml-5 flex-shrink-0 text-red-600 hover:text-red-700 disabled:opacity-40"
          >
            <Trash2 size={30} />
          </button>
        </div>
      </div>
      <div className="border-b border-slate-200 my-4"></div>
    </>
  );
}
