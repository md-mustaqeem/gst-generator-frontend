import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FileText,
  Users,
  Package,
  Download,
  MessageCircle,
  BarChart2,
  Shield,
  Zap,
  CheckCircle,
  Headphones,
  UserPlus,
  Share2,
  ChevronDown,
  ArrowRight,
  Star,
  TrendingUp,
  LayoutDashboard,
  Sparkles,
  Globe,
  Lock,
  RefreshCw,
  ArrowUpRight,
  Receipt,
  PieChart,
  IndianRupee,
  BadgeCheck,
  Bell,
  Wifi,
  CreditCard,
  QrCode,
  Building2,
  Phone,
  Mail,
  MapPin,
  Hash,
} from "lucide-react";

/* ─── Scroll Reveal ──────────────────────────────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "", from = "bottom" }) {
  const [ref, visible] = useReveal();
  const transforms = {
    bottom: visible ? "translateY(0)" : "translateY(40px)",
    left: visible ? "translateX(0)" : "translateX(-40px)",
    right: visible ? "translateX(0)" : "translateX(40px)",
    scale: visible ? "scale(1)" : "scale(0.92)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: transforms[from] || transforms.bottom,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Animated Counter ───────────────────────────────────────────────────── */
function Counter({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal();
  useEffect(() => {
    if (!visible) return;
    const dur = 2000;
    const step = Math.ceil(target / (dur / 16));
    let n = 0;
    const t = setInterval(() => {
      n = Math.min(n + step, target);
      setCount(n);
      if (n >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [visible, target]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ─── FAQ Item ───────────────────────────────────────────────────────────── */
function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
        ${
          open
            ? "border-emerald-300 shadow-lg shadow-emerald-50 bg-white"
            : "border-slate-200 bg-white/60 hover:border-emerald-200 hover:bg-white"
        }`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5 gap-4">
        <div className="flex items-center gap-4">
          <span
            className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors
            ${open ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`font-semibold transition-colors ${open ? "text-emerald-600" : "text-slate-800"}`}
          >
            {q}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-emerald-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>
      <div
        style={{
          maxHeight: open ? "200px" : "0",
          transition: "max-height 0.35s ease",
        }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-slate-600 leading-relaxed text-[15px]">
          {a}
        </p>
      </div>
    </div>
  );
}

/* ─── Floating Badge ─────────────────────────────────────────────────────── */
function FloatCard({ children, className = "", delay = 0 }) {
  return (
    <div
      className={`bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl shadow-black/10 ${className}`}
      style={{
        animation: `float 6s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite`,
        animationDelay: `${delay}s`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function CustomerHome() {
  const nav = (path) => (window.location.href = path);

  /* ---------- data ---------- */
  const features = [
    {
      icon: FileText,
      title: "GST Invoice",
      desc: "Auto-calculated CGST/SGST/IGST. Print-ready in seconds.",
      color: "from-emerald-400 to-teal-500",
      glow: "shadow-emerald-200",
    },
    {
      icon: Users,
      title: "Customer CRM",
      desc: "Full customer directory with billing history & GSTIN.",
      color: "from-blue-400 to-indigo-500",
      glow: "shadow-blue-200",
    },
    {
      icon: Package,
      title: "Product Catalogue",
      desc: "HSN codes, GST rates, bulk pricing — all managed.",
      color: "from-violet-400 to-purple-500",
      glow: "shadow-violet-200",
    },
    {
      icon: BarChart2,
      title: "Reports & Analytics",
      desc: "Live revenue graphs, GST summaries, outstanding dues.",
      color: "from-orange-400 to-rose-500",
      glow: "shadow-orange-200",
    },
    {
      icon: Download,
      title: "PDF Export",
      desc: "Pixel-perfect branded PDFs with your logo & stamp.",
      color: "from-pink-400 to-rose-500",
      glow: "shadow-pink-200",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Sharing",
      desc: "Send invoices to customers in one tap via WhatsApp.",
      color: "from-green-400 to-emerald-500",
      glow: "shadow-green-200",
    },
  ];

  const whyUs = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      desc: "AES-256 encryption. TLS 1.3. Daily automated backups.",
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Invoice generated and shared in under 30 seconds.",
      bg: "from-amber-50 to-yellow-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: CheckCircle,
      title: "Zero Errors",
      desc: "Automated tax calculations — humans make mistakes, we don't.",
      bg: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Headphones,
      title: "24×7 Support",
      desc: "Real humans, not bots. We're here whenever you need.",
      bg: "from-violet-50 to-purple-50",
      border: "border-violet-200",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
  ];

  const steps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Add Customer",
      desc: "Enter name, address and GSTIN. Done in 20 seconds.",
    },
    {
      icon: Package,
      step: "02",
      title: "Add Products",
      desc: "Pick from your catalogue or add custom items on the fly.",
    },
    {
      icon: FileText,
      step: "03",
      title: "Generate Invoice",
      desc: "GST is auto-split. Invoice is formatted and ready.",
    },
    {
      icon: Share2,
      step: "04",
      title: "Download & Share",
      desc: "Export PDF or send via WhatsApp with one click.",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Founder",
      company: "Sharma Retail Mart",
      text: "BillEase saved me 2 hours every single day. The GST breakdowns are always accurate and my CAs love the export.",
      rating: 5,
      initials: "PS",
      bg: "from-emerald-400 to-teal-500",
    },
    {
      name: "Rahul Mehta",
      role: "Freelance Designer",
      company: "Studio Mehta",
      text: "I used to dread sending invoices. Now it takes 60 seconds and looks more professional than most agencies I've worked with.",
      rating: 5,
      initials: "RM",
      bg: "from-blue-400 to-indigo-500",
    },
    {
      name: "Anjali Verma",
      role: "Director",
      company: "Verma Digital Agency",
      text: "Managing 80+ clients was chaos. BillEase centralised everything. The WhatsApp feature alone is worth switching for.",
      rating: 5,
      initials: "AV",
      bg: "from-violet-400 to-purple-500",
    },
  ];

  const faqs = [
    {
      q: "Is BillEase fully GST compliant?",
      a: "Yes. We auto-apply CGST, SGST and IGST based on transaction type, HSN codes and customer state. Every invoice meets GST rules.",
    },
    {
      q: "Can I add my company logo and branding?",
      a: "Absolutely. Upload your logo, choose accent colours, add digital signature and customise your invoice footer — it's your brand.",
    },
    {
      q: "How secure is my business data?",
      a: "We use AES-256 encryption at rest and TLS 1.3 in transit. Backups run every 24 hours. Your data is yours — we never sell it.",
    },
    {
      q: "Can I share invoices on WhatsApp directly?",
      a: "Yes. One tap sends a formatted message with your invoice PDF attached, directly from within BillEase.",
    },
    {
      q: "Do I need an accountant to use BillEase?",
      a: "No. The interface is designed for business owners. GST, totals, and breakdowns are all calculated automatically for you.",
    },
  ];

  const stats = [
    {
      target: 5000,
      suffix: "+",
      prefix: "",
      label: "Invoices Generated",
      icon: FileText,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      target: 1200,
      suffix: "+",
      prefix: "",
      label: "Happy Customers",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      target: 850,
      suffix: " Cr",
      prefix: "₹",
      label: "Revenue Tracked",
      icon: IndianRupee,
      color: "text-violet-500",
      bg: "bg-violet-50",
    },
    {
      target: 9999,
      suffix: "%",
      prefix: "",
      label: "Accuracy Rate (99.9%)",
      icon: BadgeCheck,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];

  return (
    <>
      {/* ── Global keyframes ─────────────────────────────────────────────── */}
      <style>{`
       @keyframes float {
        0% {
          transform: translateY(0px);
        }
      
        25% {
          transform: translateY(-6px);
        }
      
        50% {
          transform: translateY(-12px);
        }
      
        75% {
          transform: translateY(-6px);
        }
      
        100% {
          transform: translateY(0px);
        }
      }
        @keyframes pulse-ring { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.4);opacity:0} }
        @keyframes grid-move { 0%{transform:translateY(0)} 100%{transform:translateY(40px)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-6px); }
        .btn-scale { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .btn-scale:hover { transform: scale(1.04); }
        .btn-scale:active { transform: scale(0.97); }
        .gradient-text { background: linear-gradient(135deg, #10B981 0%, #0EA5E9 50%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .glow-emerald { box-shadow: 0 0 30px rgba(16,185,129,0.25); }
       .mesh-bg {
  background:
    radial-gradient(circle at 15% 20%, rgba(16,185,129,0.12) 0%, transparent 28%),
    radial-gradient(circle at 85% 15%, rgba(59,130,246,0.10) 0%, transparent 30%),
    radial-gradient(circle at 80% 80%, rgba(139,92,246,0.08) 0%, transparent 28%),
    radial-gradient(circle at 30% 90%, rgba(6,182,212,0.08) 0%, transparent 30%),
    linear-gradient(
      135deg,
      #161618 0%,
      #f8fafc 25%,
      #eefbf7 55%,
      #f5f3ff 80%,
      #49494e 100%
    );
}
        .dark-mesh { background: radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.08) 0%, transparent 60%), #0F172A; }
        .card-glow:hover { box-shadow: 0 8px 32px rgba(16,185,129,0.18), 0 2px 8px rgba(0,0,0,0.06); }
      `}</style>

      <div className="min-h-screen overflow-x-hidden font-sans">
        <Navbar />
        {/* ══════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[50vh] flex items-center mesh-bg overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Grid pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.03]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            {/* Blur blobs */}
            <div className="absolute -top-32 -right-32 w-[600px] h-[400px] bg-emerald-200 rounded-full blur-[100px] opacity-25" />
            <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-blue-200 rounded-full blur-[80px] opacity-20" />
            <div className="absolute -bottom-20 right-1/3 w-[300px] h-[300px] bg-violet-200 rounded-full blur-[80px] opacity-20" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20  lg:pb-2 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* ── Left ── */}
              <div className="space-y-2">
                <Reveal from="left">
                  <div className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 text-emerald-700 text-sm font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span
                        className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                        style={{
                          animation: "pulse-ring 1.5s ease-out infinite",
                        }}
                      />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    India's Smartest GST Billing Platform
                  </div>
                </Reveal>

                <Reveal from="left" delay={100}>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
                    Billing that{" "}
                    <span className="gradient-text">impresses</span>
                    <br />
                    every client
                  </h1>
                </Reveal>

                <Reveal from="left" delay={200}>
                  <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
                    Generate GST-compliant invoices, manage customers &
                    products, and share instantly via WhatsApp — all in one
                    beautiful platform.
                  </p>
                </Reveal>

                <Reveal from="left" delay={400}>
                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    {[
                      { val: "5000+", label: "Invoices" },
                      { val: "1200+", label: "Businesses" },
                      { val: "₹8.5 Cr+", label: "Revenue tracked" },
                    ].map(({ val, label }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-px h-8 bg-slate-200 hidden sm:block" />
                        <div>
                          <div className="text-xl font-extrabold text-slate-900">
                            {val}
                          </div>
                          <div className="text-xs text-slate-400">{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>

                <Reveal from="left" delay={500}>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "GST Compliant",
                      "PDF Export",
                      "WhatsApp Ready",
                      "Free to Start",
                    ].map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full"
                      >
                        <CheckCircle size={11} className="text-emerald-500" />{" "}
                        {b}
                      </span>
                    ))}
                  </div>
                </Reveal>
              </div>

              {/* ── Right – Floating Dashboard ── */}
              <Reveal from="right" delay={200}>
                <div className="relative h-[600px] hidden lg:block">
                  {/* Central glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-80 h-50 bg-emerald-300 rounded-full blur-[80px] opacity-30" />
                  </div>

                  {/* Main Invoice Card */}
                  <FloatCard
                    className="absolute left-8 top-8 w-72 p-5"
                    delay={0}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">
                          TAX INVOICE
                        </div>
                        <div className="font-extrabold text-slate-900">
                          #INV-2024-042
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={11} /> PAID
                      </span>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      {[
                        ["Office Chair", "₹12,000"],
                        ["Desk Lamp", "₹2,500"],
                        ["CGST+SGST 18%", "₹2,610"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-xs">
                          <span className="text-slate-500">{k}</span>
                          <span className="font-semibold text-slate-700">
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="h-px bg-slate-100 mb-3" />
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-slate-900">
                        Total
                      </span>
                      <span className="text-sm font-extrabold text-emerald-600">
                        ₹17,110
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 text-xs font-semibold bg-emerald-500 text-white py-2 rounded-lg flex items-center justify-center gap-1">
                        <Download size={11} /> PDF
                      </button>
                      <button className="flex-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg flex items-center justify-center gap-1">
                        <MessageCircle size={11} /> WhatsApp
                      </button>
                    </div>
                  </FloatCard>

                  {/* Revenue Card */}
                  <FloatCard
                    className="absolute right-0 top-16 p-4 w-52"
                    delay={1}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-500">
                        Monthly Revenue
                      </span>
                      <TrendingUp size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 mb-1">
                      ₹2.4 Lakh
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                      <ArrowUpRight size={12} /> +24% vs last month
                    </div>
                    <div className="mt-3 h-10 flex items-end gap-1">
                      {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-emerald-100 rounded-sm relative overflow-hidden"
                        >
                          <div
                            className="absolute bottom-0 w-full bg-emerald-500 rounded-sm transition-all"
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </FloatCard>

                  {/* Customer Card */}
                  <FloatCard
                    className="absolute left-0 bottom-32 p-4 w-48"
                    delay={2}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        MR
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Mehta Retail
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Mumbai, MH
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-slate-100 my-2" />
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Invoices</span>
                      <span className="font-bold text-slate-700">14</span>
                    </div>
                    <div className="flex justify-between text-[11px] mt-1">
                      <span className="text-slate-400">Total Billed</span>
                      <span className="font-bold text-emerald-600">₹1.8L</span>
                    </div>
                  </FloatCard>

                  {/* WhatsApp Badge */}
                  <FloatCard
                    className="absolute right-4 bottom-44 p-3 flex items-center gap-3"
                    delay={1.5}
                  >
                    <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center">
                      <MessageCircle size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Invoice Sent!
                      </div>
                      <div className="text-[10px] text-slate-400">
                        via WhatsApp · just now
                      </div>
                    </div>
                    <div
                      className="w-2 h-2 bg-green-400 rounded-full ml-1"
                      style={{ animation: "pulse-ring 1.5s infinite" }}
                    />
                  </FloatCard>

                  {/* GST Badge */}
                  <FloatCard
                    className="absolute right-24 top-4 px-3 py-2 flex items-center gap-2"
                    delay={0.5}
                  >
                    <BadgeCheck size={16} className="text-emerald-500" />
                    <span className="text-xs font-bold text-slate-700">
                      GST Verified
                    </span>
                  </FloatCard>

                  {/* Analytics pill */}
                  <FloatCard
                    className="absolute left-36 bottom-8 px-4 py-2.5 flex items-center gap-3"
                    delay={2}
                  >
                    <PieChart size={16} className="text-violet-500" />
                    <div>
                      <div className="text-[10px] text-slate-400">
                        Tax Collected
                      </div>
                      <div className="text-xs font-extrabold text-slate-800">
                        ₹38,400 GST
                      </div>
                    </div>
                  </FloatCard>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            TRUSTED BY
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-6 bg-slate-50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Reveal>
              <p className="text-center text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-8">
                Trusted by businesses across India
              </p>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Retail Stores",
                "Freelancers",
                "Startups",
                "Digital Agencies",
                "Wholesalers",
                "Consultants",
                "Manufacturers",
              ].map((cat, i) => (
                <Reveal key={cat} delay={i * 60}>
                  <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-2.5 text-slate-600 text-sm font-semibold shadow-sm hover:border-emerald-300 hover:text-emerald-600 hover:shadow-md transition-all duration-200 cursor-default">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    {cat}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-6 mesh-bg relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-[80px] opacity-40" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal className="text-center mb-6">
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3">
                Features
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
                Everything your business needs
              </h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
                A complete GST billing suite. No accounting background required
                — just your products and customers.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, desc, color, glow }, i) => (
                <Reveal key={title} delay={i * 80}>
                  <div
                    className={`group relative bg-white/80 backdrop-blur border border-white/60 rounded-3xl p-8 shadow-sm hover:shadow-2xl ${glow} card-glow hover-lift transition-all duration-300 overflow-hidden`}
                  >
                    {/* Gradient corner decoration */}
                    <div
                      className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300`}
                    />

                    <div
                      className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={24} className="text-white" />
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-xl mb-3 group-hover:text-emerald-600 transition-colors">
                      {title}
                    </h3>
                    <p className="text-slate-500 text-[15px] leading-relaxed mb-5">
                      {desc}
                    </p>
                    <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Learn more{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            WHY CHOOSE US
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-6 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-8">
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3">
                Why BillEase
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
                Built for real business owners
              </h2>
              <p className="text-slate-500 text-xl max-w-xl mx-auto">
                Not just another invoicing tool. A platform designed to grow
                with you.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyUs.map(
                (
                  { icon: Icon, title, desc, bg, border, iconBg, iconColor },
                  i,
                ) => (
                  <Reveal key={title} delay={i * 80}>
                    <div
                      className={`group relative bg-gradient-to-br ${bg} border ${border} rounded-3xl p-7 hover-lift transition-all duration-300 overflow-hidden`}
                    >
                      {/* Gradient border glow on hover */}
                      <div
                        className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${bg}`}
                      />
                      <div className="relative">
                        <div
                          className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon size={22} className={iconColor} />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                          {title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-6 dark-mesh relative overflow-hidden">
          {/* Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-emerald-500/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-emerald-500/5 pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal className="text-center mb-6">
              <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-3">
                How It Works
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
                Invoice ready in 4 steps
              </h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                From customer to WhatsApp — the entire flow takes under 2
                minutes.
              </p>
            </Reveal>

            <div className="relative">
              {/* Glowing vertical line */}
              <div className="absolute left-1/2 top-1 bottom-1 w-px -translate-x-1/2 hidden lg:block overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-transparent via-emerald-500 to-transparent opacity-60" />
              </div>

              <div className="space-y-12">
                {steps.map(({ icon: Icon, step, title, desc }, i) => (
                  <Reveal
                    key={step}
                    delay={i * 120}
                    from={i % 2 === 0 ? "left" : "right"}
                  >
                    <div
                      className={`flex items-center gap-8 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                    >
                      {/* Content card */}
                      <div className="flex-1">
                        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-7 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 max-w-md">
                          <div className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest mb-3">
                            Step {step}
                          </div>
                          <h3 className="text-2xl font-extrabold text-white mb-2">
                            {title}
                          </h3>
                          <p className="text-slate-400 leading-relaxed">
                            {desc}
                          </p>
                        </div>
                      </div>

                      {/* Centre node */}
                      <div className="hidden lg:flex flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl items-center justify-center shadow-xl shadow-emerald-500/30 glow-emerald z-10">
                        <Icon size={26} className="text-white" />
                      </div>

                      <div className="flex-1 hidden lg:block" />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            LIVE INVOICE PREVIEW
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-6 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-50 rounded-full blur-[60px]" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-50 rounded-full blur-[60px]" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal className="text-center mb-4">
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3">
                Live Preview
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
                Invoices your clients will remember
              </h2>
              <p className="text-slate-500 text-xl max-w-xl mx-auto">
                Professional, branded, GST-ready. This is what your customer
                receives.
              </p>
            </Reveal>

            <Reveal from="scale">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                  {/* Invoice header */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-40 bg-emerald-500 rounded-full blur-[80px] opacity-15" />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                            <Receipt size={18} className="text-white" />
                          </div>
                          <div>
                            <div className="font-extrabold text-white text-xl">
                              Sharma Traders
                            </div>
                            <div className="text-slate-400 text-xs">
                              GST: 36AAPCS1234K1Z2
                            </div>
                          </div>
                        </div>
                        <div className="text-slate-500 text-xs space-y-0.5">
                          <div className="flex items-center gap-1">
                            <MapPin size={10} /> 42, MG Road, Hyderabad - 500001
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone size={10} /> +91 98765 43210
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                          Tax Invoice
                        </div>
                        <div className="text-white font-extrabold text-lg">
                          #INV-2024-042
                        </div>
                        <div className="text-slate-400 text-xs mt-1">
                          Date: 22 Jun 2024
                        </div>
                        <div className="mt-3">
                          <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 justify-end">
                            <CheckCircle size={11} /> PAID
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bill to */}
                  <div className="px-8 py-6 grid grid-cols-2 gap-6 bg-slate-50/50 border-b border-slate-100">
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                        Bill To
                      </div>
                      <div className="font-extrabold text-slate-900">
                        Mehta Pvt. Ltd.
                      </div>
                      <div className="text-slate-500 text-sm">
                        GST: 27AABCM5678M1Z1
                      </div>
                      <div className="text-slate-500 text-sm">
                        Mumbai, Maharashtra
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                        Payment Info
                      </div>
                      <div className="text-slate-700 text-sm font-semibold">
                        Due Date: 06 Jul 2024
                      </div>
                      <div className="text-slate-500 text-sm">
                        Bank Transfer / UPI
                      </div>
                    </div>
                  </div>

                  {/* Items table */}
                  <div className="px-8 py-6">
                    <table className="w-full text-sm mb-6">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {["Item", "HSN", "Qty", "Rate", "Amount"].map((h) => (
                            <th
                              key={h}
                              className={`pb-3 text-xs font-bold text-slate-400 uppercase tracking-wide ${h === "Item" ? "text-left" : "text-right"}`}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {[
                          ["Office Chair", "9401", "2", "₹6,000", "₹12,000"],
                          ["Desk Lamp", "9405", "5", "₹500", "₹2,500"],
                        ].map(([item, hsn, qty, rate, amt]) => (
                          <tr key={item} className="hover:bg-slate-50/50">
                            <td className="py-3.5 text-slate-800 font-semibold">
                              {item}
                            </td>
                            <td className="py-3.5 text-slate-400 text-right">
                              {hsn}
                            </td>
                            <td className="py-3.5 text-slate-600 text-right">
                              {qty}
                            </td>
                            <td className="py-3.5 text-slate-600 text-right">
                              {rate}
                            </td>
                            <td className="py-3.5 text-slate-800 font-bold text-right">
                              {amt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Tax breakdown */}
                    <div className="bg-slate-50 rounded-2xl p-5 space-y-2 text-sm mb-6">
                      {[
                        ["Subtotal", "₹14,500", "text-slate-600"],
                        ["CGST @ 9%", "₹1,305", "text-slate-600"],
                        ["SGST @ 9%", "₹1,305", "text-slate-600"],
                      ].map(([label, val, cls]) => (
                        <div key={label} className="flex justify-between">
                          <span className={cls}>{label}</span>
                          <span className={cls}>{val}</span>
                        </div>
                      ))}
                      <div className="h-px bg-slate-200" />
                      <div className="flex justify-between text-base font-extrabold text-slate-900">
                        <span>Total Amount</span>
                        <span className="text-emerald-600">₹17,110</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 btn-scale text-sm">
                        <Download size={15} /> Download PDF
                      </button>
                      <button className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 btn-scale text-sm">
                        <MessageCircle size={15} /> Send WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            STATISTICS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-500 rounded-full blur-[100px] opacity-10" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-10" />
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
              <defs>
                <pattern
                  id="sgrid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sgrid)" />
            </svg>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal className="text-center mb-6">
              <h2 className="text-4xl font-extrabold text-white mb-4">
                The numbers speak
              </h2>
              <p className="text-slate-400 text-lg">
                Real impact, real businesses, real growth.
              </p>
            </Reveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(
                (
                  { target, suffix, prefix, label, icon: Icon, color, bg },
                  i,
                ) => (
                  <Reveal key={label} delay={i * 100}>
                    <div className="group bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-7 text-center hover:bg-white/10 hover:border-emerald-500/30 hover-lift transition-all duration-300">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 ${bg} rounded-2xl mb-5 group-hover:scale-110 transition-transform`}
                      >
                        <Icon size={22} className={color} />
                      </div>
                      <div
                        className={`text-3xl sm:text-4xl font-extrabold ${color} mb-2`}
                      >
                        {label.includes("99.9") ? (
                          "99.9%"
                        ) : (
                          <Counter
                            target={target}
                            suffix={suffix}
                            prefix={prefix}
                          />
                        )}
                      </div>
                      <div className="text-slate-400 text-sm font-medium">
                        {label.includes("99.9") ? "Accuracy Rate" : label}
                      </div>
                    </div>
                  </Reveal>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-6 bg-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-[80px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal className="text-center mb-6">
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3">
                Testimonials
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
                Loved by 1,200+ businesses
              </h2>
              <p className="text-slate-500 text-xl max-w-lg mx-auto">
                Real stories from people who switched to BillEase.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-7">
              {testimonials.map(
                ({ name, role, company, text, rating, initials, bg }, i) => (
                  <Reveal key={name} delay={i * 100}>
                    <div className="group relative bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-100 hover-lift transition-all duration-300 flex flex-col h-full overflow-hidden">
                      {/* Subtle gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-teal-50/0 group-hover:from-emerald-50/50 group-hover:to-teal-50/30 transition-all duration-500 rounded-3xl" />

                      <div className="relative">
                        {/* Stars */}
                        <div className="flex gap-1 mb-5">
                          {Array.from({ length: rating }).map((_, j) => (
                            <Star
                              key={j}
                              size={16}
                              className="text-amber-400 fill-amber-400"
                            />
                          ))}
                        </div>

                        {/* Quote */}
                        <p className="text-slate-700 leading-relaxed text-[15px] mb-8 flex-1">
                          "{text}"
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0`}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">
                              {name}
                            </div>
                            <div className="text-slate-500 text-sm">
                              {role} · {company}
                            </div>
                          </div>
                          <div className="ml-auto">
                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                              <BadgeCheck size={11} /> Verified
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-6 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-6">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
                Questions? Answered.
              </h2>
              <p className="text-slate-500 text-xl">
                Everything you need to know about BillEase.
              </p>
            </Reveal>
            <div className="space-y-3">
              {faqs.map((item, i) => (
                <Reveal key={item.q} delay={i * 60}>
                  <FAQItem q={item.q} a={item.a} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-6 relative overflow-hidden bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal from="scale">
              <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-[2.5rem] px-10 sm:px-16 py-20 text-center overflow-hidden shadow-2xl shadow-emerald-300">
                {/* Decorations */}
                <div
                  className="absolute -top-16 -right-24 w-72 h-60 bg-white/10 rounded-full"
                  style={{
                    animation: "float 4s ease-in-out infinite alternate",
                  }}
                />
                <div
                  className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full"
                  style={{
                    animation: "float 5s ease-in-out 1s infinite alternate",
                  }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />

                {/* Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.07]">
                  <defs>
                    <pattern
                      id="cgrid"
                      width="30"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 30 0 L 0 0 0 30"
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cgrid)" />
                </svg>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white text-sm font-semibold rounded-full px-4 py-2 mb-8 border border-white/30">
                    <Sparkles size={14} />
                    Start free. No credit card needed.
                  </div>

                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                    Ready to simplify
                    <br />
                    your GST billing?
                  </h2>

                  <p className="text-emerald-100 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
                    Join 1,200+ businesses saving hours every week. Beautiful
                    invoices, zero stress.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    {[
                      "GST Compliant",
                      "PDF Export",
                      "WhatsApp Sharing",
                      "Bank-Grade Security",
                    ].map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20"
                      >
                        <CheckCircle size={11} /> {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
