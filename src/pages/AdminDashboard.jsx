import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  CalendarDays,
  IndianRupee,
  Wallet,
  Users,
  Receipt,
  AlertCircle,
  PlusCircle,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { getBusiness, getDashboard } from "../api/auth";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [filter, setFilter] = useState("today");
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [dashboard, setDashboard] = useState({
    todaySale: 0,
    todayReceived: 0,
    todayDue: 0,
    todayCustomers: 0,
    todayInvoices: 0,
  });

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [businessRes, dashboardRes] = await Promise.all([
        getBusiness(),
        getDashboard(),
      ]);
      setBusiness(businessRes.data);
      setDashboard(dashboardRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  // Logic for filtering
  const getFilteredData = (key) =>
    dashboard?.[`${filter}${key.charAt(0).toUpperCase() + key.slice(1)}`] || 0;
  const sale = getFilteredData("sale");
  const received = getFilteredData("received");
  const due = getFilteredData("due");
  const customers = getFilteredData("customers");
  const invoices = getFilteredData("invoices");

  const amountData = [
    { name: "Sale", value: sale },
    { name: "Received", value: received },
    { name: "Due", value: due },
  ];
  const countData = [
    { name: "Customers", value: customers },
    { name: "Invoices", value: invoices },
  ];

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-emerald-600 font-bold text-xl">
        Loading Analytics...
      </div>
    );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500">
            Welcome back, view your business performance at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          {["today", "week", "month", "year"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f ? "bg-emerald-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard
          title="Total Sales"
          value={formatMoney(sale)}
          icon={<IndianRupee />}
          color="emerald"
        />
        <SummaryCard
          title="Received"
          value={formatMoney(received)}
          icon={<Wallet />}
          color="cyan"
        />
        <SummaryCard
          title="Pending Due"
          value={formatMoney(due)}
          icon={<AlertCircle />}
          color="red"
        />
        <SummaryCard
          title="Customers"
          value={customers}
          icon={<Users />}
          color="violet"
        />
        <SummaryCard
          title="Invoices"
          value={invoices}
          icon={<Receipt />}
          color="amber"
        />
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={amountData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip
                formatter={(v) => formatMoney(v)}
                cursor={{ fill: "#f1f5f9" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                {amountData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#10b981", "#06b6d4", "#ef4444"][index]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-lg mb-4">Collection Progress</h3>
          <div className="text-4xl font-black text-slate-900 mb-2">
            {sale > 0 ? Math.round((received / sale) * 100) : 0}%
          </div>
          <p className="text-slate-500 mb-6">Of total sales collected</p>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${sale > 0 ? (received / sale) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* ... Previous sections (Header, KPIs, Revenue Chart) ... */}

      {/* NEW Customer & Invoice Analytics Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-lg">Activity Metrics</h3>
            <p className="text-sm text-slate-500">
              Customer acquisition vs Invoices generated
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={60}>
                {countData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#8b5cf6" : "#3b82f6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Business Summary Highlight */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6">Business Highlights</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-700 pb-3">
                <span className="text-slate-400">Total Customers</span>
                <span className="font-semibold">{customers}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-3">
                <span className="text-slate-400">Total Invoices</span>
                <span className="font-semibold">{invoices}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-3">
                <span className="text-slate-400">Avg. Sale Value</span>
                <span className="font-semibold">
                  {invoices > 0 ? formatMoney(sale / invoices) : "₹0"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full mt-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} /> New Invoice
          </button>
        </div>
      </div>

      {/* Business Information Section */}
      {business && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {business.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {business.name}
                </h2>
                <p className="text-slate-400">Registered Business Account</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition flex items-center gap-2"
            >
              <PlusCircle size={20} /> Create New Invoice
            </button>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-px bg-slate-100">
            <InfoItem
              icon={<Building2 size={20} />}
              label="GST Number"
              value={business.gst}
            />
            <InfoItem
              icon={<Phone size={20} />}
              label="Phone"
              value={business.phone}
            />
            <InfoItem
              icon={<Mail size={20} />}
              label="Email"
              value={business.email}
            />
            <InfoItem
              icon={<MapPin size={20} />}
              label="Address"
              value={business.address}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon, color }) {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50",
    cyan: "text-cyan-600 bg-cyan-50",
    red: "text-red-600 bg-red-50",
    violet: "text-violet-600 bg-violet-50",
    amber: "text-amber-600 bg-amber-50",
  };
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
        {title}
      </p>
      <h3 className="text-xl font-bold mt-1 text-slate-900">{value}</h3>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="bg-white p-6 flex items-start gap-4">
      <div className="text-emerald-500 mt-1">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-slate-900 font-medium mt-1 break-all">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
