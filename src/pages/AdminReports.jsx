import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Receipt,
  Users,
  ShoppingCart,
  IndianRupee,
  Percent,
  Wallet,
  Clock3,
} from "lucide-react";

import { getDashboard } from "../api/auth";

export default function AdminReports() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalInvoices: 0,
    totalCustomers: 0,
    totalProductsSold: 0,
    totalRevenue: 0,
    totalDiscount: 0,
    totalGST: 0,
    totalReceived: 0,
    totalDue: 0,
  });

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const cards = [
    {
      title: "Invoices",
      value: dashboard.totalInvoices,
      icon: Receipt,
      color: "emerald",
    },
    {
      title: "Customers",
      value: dashboard.totalCustomers,
      icon: Users,
      color: "blue",
    },
    {
      title: "Products Sold",
      value: dashboard.totalProductsSold,
      icon: ShoppingCart,
      color: "purple",
    },
    {
      title: "Revenue",
      value: formatMoney(dashboard.totalRevenue),
      icon: IndianRupee,
      color: "orange",
    },
    {
      title: "Discount",
      value: formatMoney(dashboard.totalDiscount),
      icon: Percent,
      color: "pink",
    },
    {
      title: "GST Collected",
      value: formatMoney(dashboard.totalGST),
      icon: Receipt,
      color: "cyan",
    },
    {
      title: "Received",
      value: formatMoney(dashboard.totalReceived),
      icon: Wallet,
      color: "green",
    },
    {
      title: "Due Amount",
      value: formatMoney(dashboard.totalDue),
      icon: Clock3,
      color: "red",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      {/* ================= Dashboard Statistics ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;

          const colors = {
            emerald: {
              bg: "bg-emerald-50",
              icon: "text-emerald-600",
              border: "border-emerald-200",
            },
            blue: {
              bg: "bg-blue-50",
              icon: "text-blue-600",
              border: "border-blue-200",
            },
            purple: {
              bg: "bg-purple-50",
              icon: "text-purple-600",
              border: "border-purple-200",
            },
            orange: {
              bg: "bg-orange-50",
              icon: "text-orange-600",
              border: "border-orange-200",
            },
            pink: {
              bg: "bg-pink-50",
              icon: "text-pink-600",
              border: "border-pink-200",
            },
            cyan: {
              bg: "bg-cyan-50",
              icon: "text-cyan-600",
              border: "border-cyan-200",
            },
            green: {
              bg: "bg-green-50",
              icon: "text-green-600",
              border: "border-green-200",
            },
            red: {
              bg: "bg-red-50",
              icon: "text-red-600",
              border: "border-red-200",
            },
          };

          const style = colors[card.color];

          return (
            <div
              key={index}
              className={`group bg-white rounded-3xl border ${style.border}
  p-6 shadow-md hover:shadow-2xl hover:-translate-y-2
  transition-all duration-300 cursor-pointer`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold text-slate-800 mt-3">
                    {card.value}
                  </h2>

                  <div className="mt-5">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Live Data
                    </span>
                  </div>
                </div>

                <div
                  className={`${style.bg}
      h-16
      w-16
      rounded-2xl
      flex
      items-center
      justify-center
      group-hover:scale-110
      transition`}
                >
                  <Icon size={30} className={style.icon} />
                </div>
              </div>

              <div className="mt-6">
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    style={{
                      width: `${30 + index * 8}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= Financial Overview ================= */}

      <div className="grid lg:grid-cols-2 gap-6 py-10">
        {/* Revenue Summary */}

        <div className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-medium">Financial Summary</p>

              <h2 className="text-2xl font-bold mt-2">Revenue Overview</h2>
            </div>

            <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center">
              <IndianRupee className="text-orange-600" size={30} />
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <div className="flex justify-between text-sm">
                <span>Total Revenue</span>

                <span className="font-bold">
                  {formatMoney(dashboard.totalRevenue)}
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-400"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>GST Collected</span>

                <span className="font-bold text-cyan-600">
                  {formatMoney(dashboard.totalGST)}
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-cyan-500"
                  style={{
                    width: `${
                      dashboard.totalRevenue
                        ? (dashboard.totalGST / dashboard.totalRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>Discount Given</span>

                <span className="font-bold text-pink-600">
                  {formatMoney(dashboard.totalDiscount)}
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-pink-500"
                  style={{
                    width: `${
                      dashboard.totalRevenue
                        ? (dashboard.totalDiscount / dashboard.totalRevenue) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}

        <div className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">Payment Status</p>

              <h2 className="text-2xl font-bold mt-2">Collection Report</h2>
            </div>

            <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center">
              <Wallet className="text-green-600" size={30} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="rounded-2xl bg-green-50 p-6">
              <p className="text-green-600 font-medium">Received</p>

              <h2 className="text-3xl font-bold mt-3">
                {formatMoney(dashboard.totalReceived)}
              </h2>
            </div>

            <div className="rounded-2xl bg-red-50 p-6">
              <p className="text-red-600 font-medium">Due</p>

              <h2 className="text-3xl font-bold mt-3">
                {formatMoney(dashboard.totalDue)}
              </h2>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-sm">
              <span>Collection Progress</span>

              <span>
                {dashboard.totalRevenue
                  ? Math.round(
                      (dashboard.totalReceived / dashboard.totalRevenue) * 100,
                    )
                  : 0}
                %
              </span>
            </div>

            <div className="mt-2 h-4 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                style={{
                  width: `${
                    dashboard.totalRevenue
                      ? (dashboard.totalReceived / dashboard.totalRevenue) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
