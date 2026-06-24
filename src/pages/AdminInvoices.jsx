import { useState, useEffect, useMemo } from "react";
import { generateInvoice } from "../utils/pdfGenerator";

import {
  Search,
  Receipt,
  IndianRupee,
  Wallet,
  RefreshCw,
  CalendarDays,
  Eye,
  Trash2,
  X,
  Building2,
  User,
} from "lucide-react";

import { Printer, Download } from "lucide-react";

import {
  getAllInvoice,
  getInvoiceById,
  deleteInvoice,
  getInvoicesByDate,
  updatePayment,
} from "../api/auth";

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [open, setOpen] = useState(false);

  const [depositAmount, setDepositAmount] = useState("");
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);

      const res = await getAllInvoice();
      // console.log(res.data);
      setInvoices(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filterDate = async (value) => {
    setDate(value);

    if (!value) {
      loadInvoices();
      return;
    }

    try {
      const res = await getInvoicesByDate(value);

      setInvoices(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const filteredInvoices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return invoices;

    return invoices.filter((invoice) => {
      return (
        invoice.invoiceNo?.toLowerCase().includes(keyword) ||
        invoice.customerName?.toLowerCase().includes(keyword) ||
        String(invoice.customerPhone || "").includes(keyword) ||
        invoice.businessName?.toLowerCase().includes(keyword) ||
        invoice.items?.some((item) =>
          item.product?.toLowerCase().includes(keyword),
        )
      );
    });
  }, [search, invoices]);

  const totalRevenue = invoices.reduce(
    (sum, i) => sum + (i.grandTotal || 0),
    0,
  );

  const totalPaid = invoices.reduce((sum, i) => sum + (i.paidAmount || 0), 0);

  const totalDue = invoices.reduce((sum, i) => sum + (i.dueAmount || 0), 0);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);

  const handleView = async (id) => {
    try {
      const res = await getInvoiceById(id);

      // console.log(res.data);

      setSelectedInvoice(res.data);

      setDepositAmount("");

      setOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Invoice ?")) return;

    try {
      await deleteInvoice(id);

      loadInvoices();
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdatePayment = async () => {
    try {
      await updatePayment(selectedInvoice.id, depositAmount);

      alert("Payment Updated Successfully");

      setOpen(false);

      loadInvoices();
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";

    const d = new Date(dateTime);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hour}:${minute}`;
  };

  const handleDownload = (invoice) => {
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

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Invoice Management
          </h1>

          <p className="text-slate-500 mt-2 text-lg">
            Manage and track your business invoices
          </p>
        </div>

        <button
          onClick={loadInvoices}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Invoices"
          value={invoices.length}
          bg="from-blue-500 to-indigo-600"
        />

        <DashboardCard
          title="Total Revenue"
          value={formatMoney(totalRevenue)}
        />

        <DashboardCard
          title="Received"
          value={formatMoney(totalPaid)}
          bg="from-cyan-500 to-sky-600"
        />

        <DashboardCard title="Due Payment" value={formatMoney(totalDue)} />
      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={18} />

            <input
              type="text"
              placeholder="Search Invoice or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 border rounded-xl pl-11 pr-4 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div className="relative">
            <CalendarDays
              className="absolute left-4 top-4 text-gray-400"
              size={18}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => filterDate(e.target.value)}
              className="w-full h-12 border rounded-xl pl-11 pr-4"
            />
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-20">
                  Loading...
                </td>
              </tr>
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-20 text-slate-400">
                  No Invoice Found
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice, index) => (
                <tr
                  key={invoice.id}
                  className={`border-b hover:bg-indigo-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  <td className="p-2 font-semibold">{invoice.invoiceNo}</td>

                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">
                        {invoice.customerName}
                      </span>

                      <span className="text-sm text-slate-500">
                        {invoice.customerPhone}
                      </span>
                      <span className="text-sm text-slate-500">
                        {formatDate(invoice.invoiceDate)}
                      </span>
                    </div>
                  </td>

                  <td className="py-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-700">
                        {invoice.items?.length} Items
                      </p>

                      {invoice.items?.map((item) => (
                        <div key={item.id} className="text-xs text-slate-500">
                          • {item.product}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="font-semibold">
                    {formatMoney(invoice.grandTotal)}
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-semibold text-green-600">
                      {formatMoney(invoice.paidAmount)}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {invoice.lastPaymentDate
                        ? formatDateTime(invoice.lastPaymentDate)
                        : "-"}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-semibold text-red-600">
                      {formatMoney(invoice.dueAmount)}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {invoice.lastDueUpdateDate
                        ? formatDateTime(invoice.lastDueUpdateDate)
                        : "-"}
                    </p>
                  </td>

                  <td>
                    <div className="flex justify-center gap-2">
                      {/* Download PDF */}
                      <button
                        onClick={() => handleDownload(invoice)}
                        className="h-10 w-10 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-600 flex items-center justify-center transition"
                        title="Download PDF"
                      >
                        <Download size={18} />
                      </button>

                      {/* Print */}
                      <button
                        onClick={() => handlePrint(invoice)}
                        className="h-10 w-10 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-600 flex items-center justify-center transition"
                        title="Print Invoice"
                      >
                        <Printer size={18} />
                      </button>

                      {/* View */}
                      <button
                        onClick={() => handleView(invoice.id)}
                        className="h-10 w-10 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="h-10 w-10 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {open && selectedInvoice && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
            <div className="w-full md:w-[700px] bg-white h-screen overflow-y-auto shadow-2xl">
              {/* Header */}

              <div className="flex justify-between items-center border-b p-6">
                <h2 className="text-2xl font-bold">Invoice Details</h2>

                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Invoice */}

                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="font-bold mb-4 flex gap-2">
                      <Building2 />
                      Business
                    </h3>

                    <p>
                      <b>Name :</b> {selectedInvoice.businessName}
                    </p>

                    <p>
                      <b>GST :</b> {selectedInvoice.businessGst}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="font-bold mb-4 flex gap-2">
                      <User />
                      Customer
                    </h3>

                    <p>
                      <b>Name :</b> {selectedInvoice.customerName}
                    </p>

                    <p>
                      <b>Phone :</b> {selectedInvoice.customerPhone}
                    </p>

                    <p>
                      <b>Email :</b> {selectedInvoice.customerEmail}
                    </p>

                    <p>
                      <b>Address :</b> {selectedInvoice.customerAddress}
                    </p>
                  </div>
                </div>

                {/* Products */}

                <div>
                  <h3 className="text-xl font-bold mb-3">Products</h3>

                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-3">Product</th>

                        <th>Qty</th>

                        <th>Price</th>

                        <th>GST</th>

                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-3">{item.product}</td>

                          <td>{item.qty}</td>

                          <td>{formatMoney(item.price)}</td>

                          <td>{item.gst}%</td>

                          <td>{formatMoney(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}

                <div className="bg-slate-100 rounded-2xl p-5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>

                    <span>{formatMoney(selectedInvoice.subtotal)}</span>
                  </div>

                  <div className="flex justify-between mt-3">
                    <span>Discount</span>

                    <span>{formatMoney(selectedInvoice.discountAmount)}</span>
                  </div>

                  <div className="flex justify-between mt-3">
                    <span>GST</span>

                    <span>{formatMoney(selectedInvoice.gstAmount)}</span>
                  </div>

                  <div className="flex justify-between mt-5 text-xl font-bold">
                    <span>Grand Total</span>

                    <span>{formatMoney(selectedInvoice.grandTotal)}</span>
                  </div>
                </div>
                {/* Update Payment */}

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-lg font-semibold mb-4">Update Payment</h3>

                  <div className="mb-4">
                    <p className="text-sm text-slate-500">Current Due Amount</p>

                    <p className="text-2xl font-bold text-red-600">
                      {formatMoney(selectedInvoice.dueAmount)}
                    </p>
                  </div>

                  <label className="block text-sm font-medium mb-2">
                    Deposit Amount
                  </label>

                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Enter Deposit Amount"
                  />

                  <button
                    onClick={handleUpdatePayment}
                    className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Update Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, bg }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-500">{title}</p>

          <h2 className="text-3xl font-bold mt-3">{value}</h2>
        </div>

        {icon && (
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-r ${bg} text-white`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
