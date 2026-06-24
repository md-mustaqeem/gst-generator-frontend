import { useState } from "react";
import { Mail, Smartphone, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { forgotPassword, verifyOtp, resetPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [type, setType] = useState("email");
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    mobile: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = async () => {
    try {
      await forgotPassword({
        email: type === "email" ? form.email : "",
        mobile: type === "mobile" ? form.mobile : "",
      });

      alert("OTP Sent Successfully");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({
        email: form.email,
        mobile: form.mobile,
        otp: form.otp,
      });

      alert("OTP Verified");
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });

      alert("Password Reset Successfully");

      // Login page par redirect
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Password Reset Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Link to="/login">
            <ArrowLeft className="text-slate-600 hover:text-emerald-600" />
          </Link>

          <h1 className="text-2xl font-bold">Forgot Password</h1>
        </div>

        <p className="text-slate-500 text-sm">Reset your account password</p>

        {/* Email / Mobile */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 bg-slate-100 rounded-xl p-1 mt-6">
              <button
                onClick={() => setType("email")}
                className={`py-2 rounded-lg transition ${
                  type === "email"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600"
                }`}
              >
                Email
              </button>

              <button
                onClick={() => setType("mobile")}
                className={`py-2 rounded-lg transition ${
                  type === "mobile"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600"
                }`}
              >
                Mobile
              </button>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium">
                {type === "email" ? "Email Address" : "Mobile Number"}
              </label>

              <div className="mt-1 flex items-center border rounded-xl px-3 h-11">
                {type === "email" ? (
                  <Mail size={18} className="text-slate-400" />
                ) : (
                  <Smartphone size={18} className="text-slate-400" />
                )}

                <input
                  type={type === "email" ? "email" : "tel"}
                  name={type}
                  placeholder={
                    type === "email" ? "Enter Email" : "Enter Mobile"
                  }
                  value={form[type]}
                  onChange={handleChange}
                  className="ml-3 w-full outline-none"
                />
              </div>

              <button
                onClick={handleSendOtp}
                className="mt-6 w-full h-11 rounded-xl bg-emerald-600 text-white"
              >
                Send OTP
              </button>
            </div>
          </>
        )}

        {/* OTP */}
        {step === 2 && (
          <>
            <div className="mt-6">
              <label className="text-sm font-medium">OTP</label>

              <div className="mt-1 flex items-center border rounded-xl px-3 h-11">
                <ShieldCheck size={18} className="text-slate-400" />

                <input
                  type="text"
                  name="otp"
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                  className="ml-3 w-full outline-none tracking-[8px]"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                className="mt-6 w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
              >
                Verify OTP
              </button>

              <button
                onClick={handleSendOtp}
                className="mt-3 text-sm text-emerald-600 hover:underline w-full"
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {/* Reset Password */}
        {step === 3 && (
          <>
            <div className="mt-6">
              <label className="text-sm font-medium">New Password</label>

              <div className="mt-1 flex items-center border rounded-xl px-3 h-11">
                <Lock size={18} className="text-slate-400" />

                <input
                  type="password"
                  name="password"
                  placeholder="New Password"
                  value={form.password}
                  onChange={handleChange}
                  className="ml-3 w-full outline-none"
                />
              </div>

              <label className="text-sm font-medium mt-4 block">
                Confirm Password
              </label>

              <div className="mt-1 flex items-center border rounded-xl px-3 h-11">
                <Lock size={18} className="text-slate-400" />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="ml-3 w-full outline-none"
                />
              </div>

              <button
                onClick={handleResetPassword}
                className="mt-6 w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
              >
                Reset Password
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
