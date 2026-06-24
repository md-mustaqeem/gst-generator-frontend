import { Download, Printer, RotateCcw, FileText } from "lucide-react";
import { formatCurrency } from "../utils/format";

import { useRef } from "react";

import { generateInvoice } from "../utils/pdfGenerator";
import autoTable from "jspdf-autotable";

import { useReactToPrint } from "react-to-print";

import { numberToWords } from "../utils/numberToWords";

export default function InvoicePreview({
  business,
  customer,
  products,
  subtotal,
  discountAmount,
  gstAmount,
  grandTotal,

  paidAmount,
  dueAmount,

  invoiceSaved,
  savedInvoice,

  isTyping,

  onGenerate,

  setPaidAmount,
  setCustomer,
  setProducts,
  onReset,
}) {
  const invoiceNo = savedInvoice?.invoiceNo || "INV-2026-7788";

  const date = savedInvoice?.invoiceDate
    ? new Date(savedInvoice.invoiceDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const invoiceRef = useRef();

  // Preview Data
  const previewCustomer =
    !isTyping && invoiceSaved && savedInvoice
      ? {
          name: savedInvoice.customerName,
          phone: savedInvoice.customerPhone,
          email: savedInvoice.customerEmail,
          address: savedInvoice.customerAddress,
        }
      : customer;

  const previewProducts =
    !isTyping && invoiceSaved && savedInvoice?.items?.length
      ? savedInvoice.items
      : products;

  const previewSubtotal =
    !isTyping && invoiceSaved && savedInvoice
      ? savedInvoice.subtotal
      : subtotal;

  const previewDiscount =
    !isTyping && invoiceSaved && savedInvoice
      ? savedInvoice.discountAmount
      : discountAmount;

  const previewGST =
    !isTyping && invoiceSaved && savedInvoice
      ? savedInvoice.gstAmount
      : gstAmount;

  const previewGrandTotal =
    !isTyping && invoiceSaved && savedInvoice
      ? savedInvoice.grandTotal
      : grandTotal;

  const previewPaid =
    !isTyping && invoiceSaved && savedInvoice
      ? savedInvoice.paidAmount
      : paidAmount;

  const previewDue =
    !isTyping && invoiceSaved && savedInvoice
      ? savedInvoice.dueAmount
      : dueAmount;

  // Download PDF
  const handleDownload = () => {
    const pdf = generateInvoice({
      business,
      customer: previewCustomer,
      products: previewProducts,
      subtotal: previewSubtotal,
      discountAmount: previewDiscount,
      gstAmount: previewGST,
      grandTotal: previewGrandTotal,
      paidAmount: previewPaid,
      dueAmount: previewDue,
      invoiceNo,
      invoiceDate: savedInvoice?.invoiceDate,
    });

    pdf.doc.save(pdf.fileName);
  };

  // Print PDF
  const handlePrint = () => {
    generateInvoice({
      business,
      customer: previewCustomer,
      products: previewProducts,
      subtotal: previewSubtotal,
      discountAmount: previewDiscount,
      gstAmount: previewGST,
      grandTotal: previewGrandTotal,
      paidAmount: previewPaid,
      dueAmount: previewDue,
      invoiceNo,
      invoiceDate: savedInvoice?.invoiceDate,
      autoPrint: true,
    });
  };

  return (
    <div className="sticky top-6">
      {/* Invoice Card */}

      <div
        ref={invoiceRef}
        className="bg-white shadow-sm border overflow-hidden"
      >
        {/* Header */}

        <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white px-8 py-2">
          <div className="grid grid-cols-2 items-center">
            {/* Left */}
            <div>
              <h1 className="text-3xl font-bold mt-2">
                {business.name || "Your Business"}
              </h1>

              <p className="text-sm mt-2">
                GSTIN : {business.gst || "Not Available"}
              </p>
            </div>

            {/* Right */}
            <div className="text-right justify-self-end">
              <div className="space-y-2">
                <div>
                  <p className="text-xs opacity-80">Invoice No</p>
                  <p className="font-bold text-lg">{invoiceNo}</p>
                </div>

                <div>
                  <p className="text-xs opacity-80">Invoice Date</p>
                  <p>{date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}

        <div className="py-2 px-8">
          {/* Business & Customer */}

          <div className="grid grid-cols-2 gap-40 mb-2">
            {/* Business */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase mb-1">
                From
              </h3>

              <h2 className="font-bold text-lg">{business.name || "—"}</h2>

              <p>{business.address}</p>
              <p>{business.phone}</p>
              <p>{business.email}</p>
            </div>

            {/* Customer */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase mb-1">
                Bill To
              </h3>

              <h2 className="font-bold text-lg">
                {previewCustomer.name || "—"}
              </h2>

              <p>{previewCustomer.address || "-"}</p>
              <p>{previewCustomer.phone || "-"}</p>
              <p>{previewCustomer.email || "-"}</p>
            </div>
          </div>

          {/* Products */}

          <table className="w-full mb-8">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="w-12 text-center p-3">S.No</th>
                <th className="text-left p-3">Product</th>
                <th className="text-center">Qty</th>
                <th className="text-center">Price</th>
                <th className="text-center">Discount</th>
                <th className="text-center">GST</th>
                <th className="text-right p-3">Total</th>
              </tr>
            </thead>

            <tbody>
              {previewProducts.map((item, index) => {
                const qty = Number(item.qty) || 0;
                const price = Number(item.price) || 0;
                const discount = Number(item.discount) || 0;
                const gst = Number(item.gst) || 0;

                const subtotal = qty * price;
                const discountAmount = (subtotal * discount) / 100;
                const taxableAmount = subtotal - discountAmount;
                const gstAmount = (taxableAmount * gst) / 100;
                const total = taxableAmount + gstAmount;

                return (
                  <tr key={index} className="border-b">
                    <td className="text-center">{index + 1}</td>

                    <td className="p-3 break-all">{item.product || "-"}</td>

                    <td className="text-center">{qty}</td>

                    <td className="text-center">{formatCurrency(price)}</td>

                    <td className="text-center">
                      {discount}% <br />
                      <span className="text-xs text-slate-500">
                        ({formatCurrency(discountAmount)})
                      </span>
                    </td>

                    <td className="text-center">
                      {gst}% <br />
                      <span className="text-xs text-slate-500">
                        ({formatCurrency(gstAmount)})
                      </span>
                    </td>

                    <td className="text-right font-semibold">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary */}

          <div className="mt-8 border rounded-xl p-4">
            <p className="text-2xl font-semibold text-emerald-700">
              Amount In Words
            </p>

            <p className="font-medium">{numberToWords(previewGrandTotal)}</p>
          </div>

          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>{formatCurrency(previewSubtotal)}</span>
              </div>

              <div className="flex justify-between text-red-600">
                <span>Discount</span>
                <span>- {formatCurrency(previewDiscount)}</span>
              </div>

              <div className="flex justify-between">
                <span>GST</span>
                <span>{formatCurrency(previewGST)}</span>
              </div>

              <div className="flex justify-between text-2xl font-bold text-emerald-700 border-t pt-3">
                <span>Grand Total</span>
                <span>{formatCurrency(previewGrandTotal)}</span>
              </div>

              <hr />

              <div className="flex justify-between text-2xl font-medium text-blue-600">
                <span>Paid Amount</span>
                <span>{formatCurrency(previewPaid)}</span>
              </div>

              <div className="flex justify-between text-2xl font-medium text-orange-600">
                <span>Due Amount</span>
                <span>{formatCurrency(previewDue)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="border-t mt-10 pt-6 text-center text-slate-400">
            Thank you for your business ❤️
          </div>
        </div>
      </div>

      {/* Buttons */}

      <div className="grid grid-cols-3 gap-3 mt-6">
        {/* Save */}
        <button
          onClick={onGenerate}
          className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition-all"
        >
          <FileText
            size={17}
            className="transition-transform group-hover:scale-110"
          />
          <span>Save</span>
        </button>

        {/* Download */}
        <button
          disabled={!invoiceSaved}
          onClick={handleDownload}
          className={`group flex h-11 items-center justify-center gap-2 rounded-xl font-medium shadow transition-all
      ${
        invoiceSaved
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "bg-slate-200 text-slate-400 cursor-not-allowed"
      }`}
        >
          <Download
            size={17}
            className="transition-transform group-hover:-translate-y-0.5"
          />
          <span>Download</span>
        </button>

        {/* Print */}
        <button
          disabled={!invoiceSaved}
          onClick={handlePrint}
          className={`group flex h-11 items-center justify-center gap-2 rounded-xl font-medium shadow transition-all
      ${
        invoiceSaved
          ? "bg-white border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600"
          : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
      }`}
        >
          <Printer
            size={17}
            className="transition-transform group-hover:rotate-12"
          />
          <span>Print</span>
        </button>
      </div>
    </div>
  );
}
