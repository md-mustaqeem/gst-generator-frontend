import { useState } from "react";
import { User, Mail, Smartphone, Lock, UserPlus, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    setLoading(true);

    try {
      const response = await registerUser({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center">
            <FileText size={28} className="text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mt-4">
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>

          <p className="text-sm text-slate-500 mt-1">
            Register your GST Invoice account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="col-span-2">
            <label className="text-sm font-medium">Full Name</label>

            <div className="mt-1 flex items-center border rounded-xl px-3 h-11 focus-within:border-emerald-600">
              <User size={18} className="text-slate-400" />

              <input
                type="text"
                name="name"
                placeholder="Enter Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full ml-3 outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>

            <div className="mt-1 flex items-center border rounded-xl px-3 h-11 focus-within:border-emerald-600">
              <Mail size={18} className="text-slate-400" />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full ml-3 outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm font-medium">Mobile</label>

            <div className="mt-1 flex items-center border rounded-xl px-3 h-11 focus-within:border-emerald-600">
              <Smartphone size={18} className="text-slate-400" />

              <input
                type="tel"
                name="mobile"
                maxLength={10}
                placeholder="Mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full ml-3 outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>

            <div className="mt-1 flex items-center border rounded-xl px-3 h-11 focus-within:border-emerald-600">
              <Lock size={18} className="text-slate-400" />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full ml-3 outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium">Confirm</label>

            <div className="mt-1 flex items-center border rounded-xl px-3 h-11 focus-within:border-emerald-600">
              <Lock size={18} className="text-slate-400" />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full ml-3 outline-none text-sm"
                required
              />
            </div>
          </div>

          {error && (
            <div className="col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Register Button */}
          <div className="col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2
             transition-all duration-300 ease-in-out
             hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30
             active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </div>

          {/* Login */}
          <div className="col-span-2 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
