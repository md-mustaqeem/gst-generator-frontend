import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Repeat,
  Search,
  CalendarDays,
  IndianRupee,
  Wallet,
  Clock3,
  RefreshCw,
} from "lucide-react";
import { getAllCustomers, getAllInvoice } from "../api/auth";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // Today's Date (yyyy-mm-dd)
  // const [selectedDate, setSelectedDate] = useState(
  //   new Date().toISOString().split("T")[0],
  // );

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

      setCustomers(customerRes.data);
      setInvoices(invoiceRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        customer.name?.toLowerCase().includes(keyword) ||
        customer.phone?.includes(keyword) ||
        customer.email?.toLowerCase().includes(keyword);

      const matchesDate =
        !selectedDate ||
        customer.customerSince === selectedDate ||
        customer.lastPurchaseDate === selectedDate;

      return matchesSearch && matchesDate;
    });
  }, [customers, search, selectedDate]);

  const totalCustomers = filteredCustomers.length;

  const newCustomers = filteredCustomers.filter(
    (c) => c.customerSince === selectedDate,
  ).length;

  const returningCustomers = totalCustomers - newCustomers;

  const totalBusiness = filteredCustomers.reduce(
    (sum, c) => sum + (c.totalBusiness || 0),
    0,
  );

  const totalPaid = filteredCustomers.reduce(
    (sum, c) => sum + (c.totalPaid || 0),
    0,
  );

  const totalDue = filteredCustomers.reduce(
    (sum, c) => sum + (c.totalDue || 0),
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

  const handleRefresh = async () => {
    setSearch("");
    setSelectedDate("");
    await loadCustomers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Customer Management</h1>

          <p className="text-slate-400 mt-1">
            View customer details, payment history and purchase analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={loadCustomers}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow transition"
          >
            <Repeat size={18} />
            Refresh
          </button>

          {/* Total Customers */}
          <div className="bg-emerald-600 text-white px-5 py-3 rounded-xl shadow">
            Total Customers : {totalCustomers}
          </div>
        </div>
      </div>

      {/* Search & Filter */}

      <div className="bg-white rounded-xl shadow p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}

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

        {/* Date */}

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

      {/* Customer Table */}

      <div className="bg-white  shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr className="text-slate-700">
              <th className="w-[24%] px-6 py-4 text-left font-semibold">
                Customer
              </th>

              <th className="w-[26%] px-6 py-4 text-left font-semibold">
                Invoice History
              </th>

              <th className="w-[8%] px-4 py-4 text-center font-semibold">
                Products
              </th>

              <th className="w-[12%] px-4 py-4 text-center font-semibold">
                Total
              </th>

              <th className="w-[10%] px-4 py-4 text-center font-semibold">
                Paid
              </th>

              <th className="w-[10%] px-4 py-4 text-center font-semibold">
                Due
              </th>

              <th className="w-[10%] px-6 py-4 text-center font-semibold">
                History
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No Customers Found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer, index) => (
                <tr
                  key={customer.id || index}
                  className="border-b hover:bg-slate-50"
                >
                  {/* Customer Details */}
                  <td className="px-3 py-6 align-top">
                    <h3 className="font-bold text-lg text-slate-800">
                      {customer.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-2">
                      📞 {customer.phone}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      📍 {customer.address}
                    </p>
                  </td>

                  {/* Invoices */}
                  <td className="align-top px-4 py-5 w-70">
                    <p className="font-semibold text-slate-700 mb-4">
                      {customer.totalInvoices} Invoices
                    </p>

                    <div className="space-y-3">
                      {invoices
                        .filter((i) => i.customerId === customer.id)
                        .map((invoice) => (
                          <div
                            key={invoice.id}
                            className="flex justify-between items-center border-b pb-2"
                          >
                            <div>
                              <p className="font-semibold text-indigo-600">
                                {invoice.invoiceNo}
                              </p>

                              <p className="text-xs text-slate-500">
                                {formatDate(invoice.invoiceDate)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </td>

                  {/* Products */}
                  <td className="align-middle text-center">
                    <span className="text-xl font-bold text-indigo-600">
                      {customer.totalProducts}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="align-middle text-right px-4">
                    <span className="text-xl font-bold text-slate-800">
                      {formatMoney(customer.totalBusiness)}
                    </span>
                  </td>

                  {/* Paid */}
                  <td className="align-middle text-right px-4">
                    <p className="font-bold text-green-600 text-xl">
                      {formatMoney(customer.totalPaid)}
                    </p>

                    <p className="text-xs text-slate-500">
                      {formatDate(customer.lastPaymentDate)}
                    </p>
                  </td>

                  {/* Due */}
                  <td className="align-middle text-right px-4">
                    <p className="font-bold text-red-600 text-xl">
                      {formatMoney(customer.totalDue)}
                    </p>

                    <p className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(customer.lastDueDate)}
                    </p>
                  </td>

                  {/* Customer History */}
                  <td className="px-6 py-6 align-middle min-w-[170px]">
                    <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                          Last Purchase
                        </p>

                        <p className="mt-2 font-bold text-lg text-slate-800 whitespace-nowrap">
                          {formatDate(customer.lastPurchaseDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                          Customer Since
                        </p>

                        <p className="mt-2 font-bold text-lg text-slate-800 whitespace-nowrap">
                          {formatDate(customer.customerSince)}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
