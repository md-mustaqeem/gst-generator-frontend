import {
  LayoutDashboard,
  Building2,
  Users,
  Receipt,
  FileBarChart,
  Settings,
  CircleDollarSign,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const menus = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "DuePaid", icon: CircleDollarSign, path: "/duepaid" },
    { title: "Customers", icon: Users, path: "/customers" },
    { title: "Invoices", icon: Receipt, path: "/invoices" },
    { title: "Reports", icon: FileBarChart, path: "/reports" },
    { title: "Business", icon: Building2, path: "/business" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside className="fixed top-14 left-0 w-[200px] h-[calc(100vh-56px)] bg-slate-900 text-white overflow-y-auto">
      {" "}
      <nav className="p-4 space-y-2">
        {menus.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg ${
                isActive ? "bg-emerald-600" : "hover:bg-slate-800"
              }`
            }
          >
            <item.icon size={20} />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
