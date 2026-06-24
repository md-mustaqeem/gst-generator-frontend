import { generateInvoice } from "../utils/pdfGenerator";
import { Download, Printer, Pencil, Search } from "lucide-react";
import { useState } from "react";

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

export default function RecentInvoices({
  invoices,
  selectedDate,
  handleDateChange,
  handleEdit,
}) {
  const handleDownload = (invoice) => {
    console.log(invoice);
    const pdf = generateInvoice({
      business: {
        name: invoice.businessName,
        gst: invoice.businessGst,
        phone: invoice.businessPhone,
        email: invoice.businessEmail,
        address: invoice.businessAddress,
      },
      customer: {
        name: invoice.customerName,
        phone: invoice.customerPhone,
        email: invoice.customerEmail,
        address: invoice.customerAddress,
      },
      products: invoice.items,
      subtotal: invoice.subtotal,
      discountAmount: invoice.discountAmount,
      gstAmount: invoice.gstAmount,
      grandTotal: invoice.grandTotal,
      paidAmount: invoice.paidAmount,
      dueAmount: invoice.dueAmount,
      invoiceNo: invoice.invoiceNo,
      invoiceDate: invoice.invoiceDate,
    });

    pdf.doc.save(pdf.fileName);
  };

  const handlePrint = (invoice) => {
    generateInvoice({
      business: {
        name: invoice.businessName,
        gst: invoice.businessGst,
        phone: invoice.businessPhone,
        email: invoice.businessEmail,
        address: invoice.businessAddress,
      },
      customer: {
        name: invoice.customerName,
        phone: invoice.customerPhone,
        email: invoice.customerEmail,
        address: invoice.customerAddress,
      },
      products: invoice.items,
      subtotal: invoice.subtotal,
      discountAmount: invoice.discountAmount,
      gstAmount: invoice.gstAmount,
      grandTotal: invoice.grandTotal,
      paidAmount: invoice.paidAmount,
      dueAmount: invoice.dueAmount,
      invoiceNo: invoice.invoiceNo,
      invoiceDate: invoice.invoiceDate,
      autoPrint: true,
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };

  const [search, setSearch] = useState("");
  const filteredInvoices = invoices.filter((invoice) => {
    const value = search.toLowerCase();

    return (
      invoice.invoiceNo?.toLowerCase().includes(value) ||
      invoice.customerName?.toLowerCase().includes(value) ||
      invoice.customerPhone?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-5 border-b bg-white">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Recent Invoice History
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            View and manage your recently generated invoices
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search Invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-72 rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Date */}
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm"
          />

          {/* Count */}
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 h-11">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

            <span className="font-semibold text-emerald-700">
              {filteredInvoices.length} Invoice
              {filteredInvoices.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">Invoice</th>
              <th className="px-5 py-3 text-left w-[180px]">Customer</th>
              <th className="px-3 py-3 text-left w-[180px]">Products</th>
              <th className="px-3 py-3 text-left w-[220px]">Address</th>
              <th className="px-2 py-3 text-center whitespace-nowrap">Date</th>
              <th className="px-3 py-3 text-right">Total</th>
              <th className="px-3 py-3 text-right text-green-600">Paid</th>
              <th className="px-3 py-3 text-right text-orange-600">Due</th>
              <th className="px-3 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b hover:bg-slate-50 transition align-top"
                >
                  {/* Invoice */}
                  <td className="px-3 py-4 whitespace-nowrap font-semibold text-slate-800">
                    {invoice.invoiceNo}
                  </td>

                  {/* Customer */}
                  <td className="px-3 py-4 w-[180px]">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {invoice.customerName}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        📞 {invoice.customerPhone}
                      </p>
                    </div>
                  </td>

                  {/* Products */}
                  <td className="px-3 py-4 w-[180px]">
                    <div className="flex flex-col gap-1">
                      {invoice.items?.length > 0 ? (
                        <>
                          {invoice.items.map((item) => (
                            <span
                              key={item.id}
                              className="inline-flex w-fit rounded-full bg-blue-100 text-blue-700 text-xs px-2 py-1"
                            >
                              {item.product} × {item.qty}
                            </span>
                          ))}
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs">
                          No Products
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Address */}
                  <td className="px-3 py-4 w-[220px]">
                    <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 leading-5 break-words">
                      {invoice.customerAddress
                        ?.split(",")
                        .map((line, index) => (
                          <div key={index}>{line.trim()}</div>
                        ))}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-2 py-4 text-center whitespace-nowrap">
                    {formatDate(invoice.invoiceDate)}
                  </td>

                  {/* Total */}
                  <td className="px-3 py-4 text-right font-semibold whitespace-nowrap">
                    {formatCurrency(invoice.grandTotal)}
                  </td>

                  {/* Paid */}
                  <td className="px-3 py-4 text-right whitespace-nowrap">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(invoice.paidAmount)}
                    </span>
                  </td>

                  {/* Due */}
                  <td className="px-3 py-4 text-right whitespace-nowrap">
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(invoice.dueAmount)}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-3 py-4">
                    <div className="flex justify-center gap-2">
                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(invoice)}
                        title="Edit"
                        className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        <Pencil size={18} className="mx-auto" />
                      </button>

                      {/* Download */}
                      <button
                        onClick={() => handleDownload(invoice)}
                        title="Download"
                        className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      >
                        <Download size={18} className="mx-auto" />
                      </button>

                      {/* Print */}
                      <button
                        onClick={() => handlePrint(invoice)}
                        title="Print"
                        className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100"
                      >
                        <Printer size={18} className="mx-auto" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500">
                  <p className="text-lg font-semibold">No Invoice Found</p>
                  <p className="text-sm mt-1">
                    Create your first invoice to see it here.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
