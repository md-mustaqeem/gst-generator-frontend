import { useState } from "react";
import { FileText, Mail, Smartphone, Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import {
  loginUser,
  sendEmailLoginOtp,
  verifyEmailLoginOtp,
  sendMobileLoginOtp,
  verifyMobileLoginOtp,
} from "../api/auth";

export default function Login() {
  const [type, setType] = useState("password");
  const [val, setVal] = useState({
    email: "",
    mobile: "",
    password: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      if (type === "email") {
        await sendEmailLoginOtp({
          email: val.email,
        });
      } else {
        await sendMobileLoginOtp({
          mobile: val.mobile,
        });
      }

      alert("OTP Sent Successfully");
      setOtpSent(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (type === "email") {
        response = await verifyEmailLoginOtp({
          email: val.email,
          otp: val.otp,
        });
      } else {
        response = await verifyMobileLoginOtp({
          mobile: val.mobile,
          otp: val.otp,
        });
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await loginUser({
        email: val.email,
        password: val.password,
      });

      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center">
            <FileText className="text-white" size={30} />
          </div>
        </div>
        <div className="text-center mt-5">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-slate-500 mt-2">
            Sign in to your GST Invoice account
          </p>
        </div>

        <div className="grid grid-cols-3 bg-slate-100 rounded-xl p-1 mt-8">
          {["password", "mobile", "email"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setOtpSent(false);
              }}
              className={`rounded-lg py-2 text-sm font-medium transition ${type === t ? "bg-emerald-600 text-white" : "text-slate-600"}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}{" "}
              {t !== "password" && "OTP"}
            </button>
          ))}
        </div>

        <form
          onSubmit={type === "password" ? handleLogin : handleVerifyOtp}
          className="mt-4 space-y-3"
        >
          {type === "password" ? (
            <>
              <div className="flex items-center border rounded-xl px-3 h-12 focus-within:border-emerald-600">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Email or Mobile"
                  value={val.email}
                  onChange={(e) => setVal({ ...val, email: e.target.value })}
                  className="w-full ml-3 outline-none"
                />
              </div>
              <div className="flex items-center border rounded-xl px-3 h-12 focus-within:border-emerald-600">
                <Lock size={18} className="text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={val.password}
                  onChange={(e) => setVal({ ...val, password: e.target.value })}
                  className="w-full ml-3 outline-none"
                />
              </div>
              <div className="text-right">
                <Link
                  to="/forgotpassword"
                  className="text-sm text-emerald-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-emerald-600 text-white font-semibold
             flex items-center justify-center gap-2
             transition-all duration-300 ease-in-out
             hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/30
             hover:-translate-y-0.5
             active:scale-95
             disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn
                      size={20}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                    Login
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center border rounded-xl px-3 h-12 focus-within:border-emerald-600">
                {type === "mobile" ? (
                  <Smartphone size={18} className="text-slate-400" />
                ) : (
                  <Mail size={18} className="text-slate-400" />
                )}
                <input
                  type={type === "mobile" ? "tel" : "email"}
                  placeholder={
                    type === "mobile" ? "Enter Mobile" : "Enter Email"
                  }
                  value={type === "mobile" ? val.mobile : val.email}
                  onChange={(e) =>
                    setVal({
                      ...val,
                      [type]: e.target.value.replace(
                        type === "mobile" ? /\D/g : "",
                        "",
                      ),
                    })
                  }
                  className="w-full ml-3 outline-none"
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Send OTP
                </button>
              ) : (
                <>
                  <div className="flex items-center border rounded-xl px-3 h-12 focus-within:border-emerald-600">
                    <Lock size={18} className="text-slate-400" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={val.otp}
                      onChange={(e) =>
                        setVal({
                          ...val,
                          otp: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="w-full ml-3 outline-none tracking-[8px] text-center"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Verify & Login
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full text-emerald-600 hover:underline text-sm"
                  >
                    Resend OTP
                  </button>
                </>
              )}
            </>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
