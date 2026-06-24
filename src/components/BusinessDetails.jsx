import { Building2, Pencil, X } from "lucide-react";
import { useState } from "react";

export default function BusinessDetails({ business = {}, onChange, onSave }) {
  const [isEditing, setIsEditing] = useState(false);

  const set = (key, value) => {
    onChange({
      ...business,
      [key]: value,
    });
  };

  const errors = {
    name: !business?.name?.trim(),

    gst:
      business?.gst &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
        (business.gst || "").toUpperCase(),
      ),

    phone: business?.phone && !/^[6-9]\d{9}$/.test(business.phone),

    address: !business?.address?.trim() || business.address.trim().length < 5,
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 size={20} className="text-blue-600" />
          </div>

          <h2 className="text-xl font-semibold">Business Details</h2>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Pencil size={18} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border"
            >
              <X size={18} />
              Cancel
            </button>

            <button
              onClick={() => {
                onSave?.();
                setIsEditing(false);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 shadow"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Business Name */}

        <div>
          <label className="text-sm font-medium">Business Name</label>

          <input
            disabled={!isEditing}
            value={business?.name || ""}
            onChange={(e) => set("name", e.target.value)}
            className={`mt-1 w-full h-11 rounded-lg border px-3 ${
              !isEditing ? "bg-slate-100 cursor-not-allowed" : ""
            } ${errors.name ? "border-red-500" : "border-slate-300"}`}
          />
        </div>

        {/* GST */}

        <div>
          <label className="text-sm font-medium">GST Number</label>

          <input
            disabled={!isEditing}
            value={business?.gst || ""}
            onChange={(e) => set("gst", e.target.value.toUpperCase())}
            className={`mt-1 w-full h-11 rounded-lg border px-3 ${
              !isEditing ? "bg-slate-100 cursor-not-allowed" : ""
            } ${errors.gst ? "border-red-500" : "border-slate-300"}`}
          />
        </div>

        {/* Phone */}

        <div>
          <label className="text-sm font-medium">Phone</label>

          <input
            disabled={!isEditing}
            value={business?.phone || ""}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
            className={`mt-1 w-full h-11 rounded-lg border px-3 ${
              !isEditing ? "bg-slate-100 cursor-not-allowed" : ""
            } ${errors.phone ? "border-red-500" : "border-slate-300"}`}
          />
        </div>

        {/* Email */}

        <div>
          <label className="text-sm font-medium">Email</label>

          <input
            disabled={!isEditing}
            value={business?.email || ""}
            onChange={(e) => set("email", e.target.value)}
            className={`mt-1 w-full h-11 rounded-lg border px-3 ${
              !isEditing ? "bg-slate-100 cursor-not-allowed" : ""
            } border-slate-300`}
          />
        </div>

        {/* Address */}

        <div className="col-span-2">
          <label className="text-sm font-medium">Address</label>

          <textarea
            rows={4}
            disabled={!isEditing}
            value={business?.address || ""}
            onChange={(e) => set("address", e.target.value)}
            className={`mt-1 w-full rounded-lg border px-3 py-2 resize-none ${
              !isEditing ? "bg-slate-100 cursor-not-allowed" : ""
            } ${errors.address ? "border-red-500" : "border-slate-300"}`}
          />
        </div>
      </div>
    </div>
  );
}
