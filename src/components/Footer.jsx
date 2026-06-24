export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-800 bg-slate-900">
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div>
          <h2 className="text-lg font-bold text-white">Smart GST Invoice</h2>

          <p className="text-sm text-slate-400 mt-1">
            Generate GST-compliant invoices quickly and securely.
          </p>
        </div>

        {/* Center */}
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-emerald-400 transition">
            Privacy Policy
          </a>

          <a href="#" className="hover:text-emerald-400 transition">
            Terms
          </a>

          <a href="#" className="hover:text-emerald-400 transition">
            Contact
          </a>
        </div>

        {/* Right */}
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} Smart GST Invoice
          <br />
          All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
