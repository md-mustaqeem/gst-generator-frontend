import { UserRound } from "lucide-react";

export default function CustomerDetails({ customer, onChange, setIsTyping }) {
  const set = (key, value) => {
    setIsTyping(true);

    onChange({
      ...customer,
      [key]: value,
    });
  };
  const errors = {
    name: (customer.name || "").trim() === "",
    phone: !/^[6-9]\d{9}$/.test(customer.phone || ""),
    email:
      (customer.email || "") !== "" &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(customer.email || ""),
    address: (customer.address || "").trim() === "",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <UserRound size={20} className="text-blue-600" />
        </div>

        <h2 className="text-lg font-semibold">Customer Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Customer Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="John Doe"
            value={customer.name || ""}
            onChange={(e) => set("name", e.target.value)}
            className={`w-full h-11 rounded-xl px-3 border outline-none transition
            ${
              errors.name
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }`}
          />

          {errors.name && (
            <p className="text-xs text-red-500 mt-1">
              Customer name is required.
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>

          <input
            type="tel"
            maxLength={10}
            placeholder="9876543210"
            value={customer.phone || ""}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
            className={`w-full h-11 rounded-xl px-3 border outline-none transition
            ${
              errors.phone
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }`}
          />

          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">
              Enter a valid 10-digit mobile number.
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>

          <input
            type="email"
            placeholder="john@example.com"
            value={customer.email || ""}
            onChange={(e) => set("email", e.target.value)}
            className={`w-full h-11 rounded-xl px-3 border outline-none transition
            ${
              errors.email
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }`}
          />

          {errors.email && (
            <p className="text-xs text-red-500 mt-1">Invalid email address.</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Address <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="Customer Address"
            value={customer.address || ""}
            onChange={(e) => set("address", e.target.value)}
            className={`w-full h-11 rounded-xl px-3 border outline-none transition
            ${
              errors.address
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }`}
          />

          {errors.address && (
            <p className="text-xs text-red-500 mt-1">Address is required.</p>
          )}
        </div>
      </div>
    </div>
  );
}
