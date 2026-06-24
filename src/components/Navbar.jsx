import {
  FileText,
  UserCircle,
  LayoutDashboard,
  Receipt,
  LogOut,
  House,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center shadow-lg">
              <FileText size={24} className="text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                GST Invoice
              </h1>
              <p className="text-xs text-slate-500">Smart Billing Solution</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300"
            >
              <House size={18} />
              Home
            </button>

            <button
              onClick={() => navigate("/invoice")}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 transition-all duration-300"
            >
              <Receipt size={18} />
              Invoice
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="relative">
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-semibold transition-all"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2"
              >
                <UserCircle
                  size={42}
                  className="text-emerald-600 hover:text-emerald-700"
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  {/* Profile */}
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-5 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                        M
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {user?.name || "Guest"}
                        </h3>

                        <p className="text-sm text-emerald-100">
                          {user?.email || user?.mobile || "No Email"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        window.open("/dashboard", "_blank");
                        setOpen(false);
                      }}
                      className="group flex items-center justify-between w-full px-5 py-3 hover:bg-emerald-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition">
                          <LayoutDashboard
                            size={18}
                            className="text-emerald-600 group-hover:text-white"
                          />
                        </div>

                        <div className="text-left">
                          <p className="font-medium text-slate-800">
                            Dashboard
                          </p>

                          <span className="text-xs text-slate-500">
                            Manage your account
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="mx-4 border-t my-2"></div>

                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setOpen(false);
                        navigate("/", { replace: true });
                      }}
                      className="group flex items-center justify-between w-full px-5 py-3 hover:bg-red-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-600 transition">
                          <LogOut
                            size={18}
                            className="text-red-600 group-hover:text-white"
                          />
                        </div>

                        <div className="text-left">
                          <p className="font-medium text-red-600">Logout</p>

                          <span className="text-xs text-slate-500">
                            Sign out from account
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
