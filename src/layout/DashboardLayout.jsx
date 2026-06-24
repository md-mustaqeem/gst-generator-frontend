import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950 ml-50 mt-8 p-1">
      <AdminNavbar />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 min-w-0 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
