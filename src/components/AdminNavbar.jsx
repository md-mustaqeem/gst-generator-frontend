import { LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white shadow-md border-b z-50 flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold text-emerald-600">
        GST Invoice Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <UserCircle className="text-emerald-600" size={34} />

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}
