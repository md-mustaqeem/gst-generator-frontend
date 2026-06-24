import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerHome from "./pages/CustomerHome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import DashboardLayout from "./layout/DashboardLayout";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminBusiness from "./pages/AdminBusiness";
import AdminCustomers from "./pages/AdminCustomers";
import AdminInvoices from "./pages/AdminInvoices";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import AdminDuePaid from "./pages/AdminDuePaid";

import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {/* Public Routes */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/invoice" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Admin Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/business" element={<AdminBusiness />} />
          <Route path="/customers" element={<AdminCustomers />} />
          <Route path="/invoices" element={<AdminInvoices />} />
          <Route path="/reports" element={<AdminReports />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/duepaid" element={<AdminDuePaid />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
