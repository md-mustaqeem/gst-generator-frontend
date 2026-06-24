import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, Search, CalendarDays } from "lucide-react";

import { getAllCustomers, getAllInvoice } from "../api/auth";

export default function AdminDuePaid() {
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("due");

  const [search, setSearch] = useState("");

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const [customerRes, invoiceRes] = await Promise.all([
        getAllCustomers(),
        getAllInvoice(),
      ]);

      setCustomers(customerRes.data || []);
      setInvoices(invoiceRes.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    // Agar date select nahi hai to sab customers
    if (!selectedDate) {
      return customers.filter((customer) => {
        const keyword = search.toLowerCase();

        return (
          customer.name?.toLowerCase().includes(keyword) ||
          customer.phone?.includes(keyword) ||
          customer.email?.toLowerCase().includes(keyword)
        );
      });
    }

    // Date ke invoices
    const invoicePhones = new Set(
      invoices
        .filter((invoice) => invoice.invoiceDate === selectedDate)
        .map((invoice) => invoice.customerPhone),
    );

    return customers.filter((customer) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        customer.name?.toLowerCase().includes(keyword) ||
        customer.phone?.includes(keyword) ||
        customer.email?.toLowerCase().includes(keyword);

      return matchesSearch && invoicePhones.has(customer.phone);
    });
  }, [customers, invoices, search, selectedDate]);

  // Date Wise
  const dueCustomers = filteredCustomers.filter(
    (customer) => Number(customer.totalDue || 0) > 0,
  );

  const paidCustomers = filteredCustomers.filter(
    (customer) => Number(customer.totalDue || 0) === 0,
  );

  // Overall
  const overallDueCustomers = customers.filter(
    (customer) => Number(customer.totalDue || 0) > 0,
  );

  const overallPaidCustomers = customers.filter(
    (customer) => Number(customer.totalDue || 0) === 0,
  );

  const overallDueAmount = overallDueCustomers.reduce(
    (sum, customer) => sum + Number(customer.totalDue || 0),
    0,
  );

  const overallPaidAmount = overallPaidCustomers.reduce(
    (sum, customer) => sum + Number(customer.totalPaid || 0),
    0,
  );

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    return d.toLocaleDateString("en-GB").replace(/\//g, "-");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>

          <p className="text-slate-500 font-medium">Loading Customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Due & Paid Customers
          </h1>

          <p className="text-slate-400 mt-1">
            View customer payment status and invoice history.
          </p>
        </div>
      </div>

      {/* Search + Date */}

      <div className="bg-white rounded-xl shadow p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative w-full lg:w-96">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays className="text-slate-500" size={18} />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border px-4 py-2"
          />
        </div>
      </div>

      {/* Toggle */}

      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab("due")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            activeTab === "due"
              ? "bg-red-600 text-white"
              : "bg-red-100 text-red-600"
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock size={18} />
            Due Customers (
            {selectedDate ? dueCustomers.length : overallDueCustomers.length})
          </div>
        </button>

        <button
          onClick={() => setActiveTab("paid")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            activeTab === "paid"
              ? "bg-emerald-600 text-white"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={18} />
            Paid Customers (
            {selectedDate ? paidCustomers.length : overallPaidCustomers.length})
          </div>
        </button>
      </div>
      {/* Table */}

      <div className="bg-white  shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead
              className={activeTab === "due" ? "bg-red-50" : "bg-emerald-50"}
            >
              <tr>
                <th className="px-5 py-4 text-left">Customer</th>

                <th className="px-5 py-4 text-left">Phone</th>

                <th className="px-5 py-4 text-left">Invoice History</th>

                <th className="px-5 py-4 text-left">Products</th>

                <th className="px-5 py-4 text-right">Total Business</th>

                <th className="px-5 py-4 text-right">Total Paid</th>

                <th className="px-5 py-4 text-right">Total Due</th>

                <th className="px-5 py-4 text-center">Customer Since</th>
              </tr>
            </thead>

            <tbody>
              {(activeTab === "due" ? dueCustomers : paidCustomers).length ===
              0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500">
                    No Customer Found
                  </td>
                </tr>
              ) : (
                (activeTab === "due" ? dueCustomers : paidCustomers).map(
                  (customer) => {
                    const customerInvoices = invoices.filter(
                      (invoice) => invoice.customerPhone === customer.phone,
                    );

                    return (
                      <tr
                        key={customer.id}
                        className="border-b hover:bg-slate-50 transition"
                      >
                        {/* Customer */}

                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold">{customer.name}</p>

                            <p className="text-xs text-slate-500">
                              {customer.email || "-"}
                            </p>
                          </div>
                        </td>

                        {/* Phone */}

                        <td className="px-5 py-4">{customer.phone}</td>

                        {/* Invoice History */}

                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-2">
                            {customerInvoices.length > 0
                              ? customerInvoices.map((invoice) => (
                                  <div
                                    key={invoice.id}
                                    className="text-xs bg-slate-100 rounded-lg px-2 py-1"
                                  >
                                    <div>
                                      <b>{invoice.invoiceNo}</b>
                                    </div>

                                    <div>{formatDate(invoice.invoiceDate)}</div>
                                  </div>
                                ))
                              : "-"}
                          </div>
                        </td>

                        {/* Products */}

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            {customerInvoices.flatMap((invoice) =>
                              invoice.items?.map((item) => (
                                <span
                                  key={`${invoice.id}-${item.id}`}
                                  className="bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs"
                                >
                                  {item.product} × {item.qty}
                                </span>
                              )),
                            )}
                          </div>
                        </td>

                        {/* Business */}

                        <td className="px-5 py-4 text-right font-semibold">
                          {formatMoney(customer.totalBusiness)}
                        </td>

                        {/* Paid */}

                        <td className="px-5 py-4 text-right text-green-600 font-bold">
                          {formatMoney(customer.totalPaid)}
                        </td>

                        {/* Due */}

                        <td className="px-5 py-4 text-right">
                          <span
                            className={`font-bold ${
                              customer.totalDue > 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatMoney(customer.totalDue)}
                          </span>
                        </td>

                        {/* Since */}

                        <td className="px-3 py-4 text-center">
                          {formatDate(customer.customerSince)}
                        </td>
                      </tr>
                    );
                  },
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
