import { FileText, PlusCircle, Users, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-white text-3xl font-bold mb-8">Welcome Admin 👋</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <Receipt className="text-emerald-600" size={35} />
          <h3 className="mt-4 text-xl font-bold">120</h3>
          <p>Total Invoices</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <Users className="text-blue-600" size={35} />
          <h3 className="mt-4 text-xl font-bold">55</h3>
          <p>Customers</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <FileText className="text-orange-500" size={35} />
          <h3 className="mt-4 text-xl font-bold">₹2,35,000</h3>
          <p>Total Revenue</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <PlusCircle className="text-purple-600" size={35} />
          <h3 className="mt-4 text-xl font-bold">Create</h3>

          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2"
          >
            New Invoice
          </button>
        </div>
      </div>
    </>
  );
}
