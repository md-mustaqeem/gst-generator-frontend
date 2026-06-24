import { useEffect, useState } from "react";
import { User, Mail, Phone, Save, Edit3, X } from "lucide-react";

import { getProfile, updateProfile } from "../api/auth";

export default function AdminSettings() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();

      const data = {
        name: res.name || "",
        email: res.email || "",
        mobile: res.mobile || "",
      };

      setForm(data);
      setOriginalForm(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const updated = await updateProfile(form);

      setForm(updated);
      setOriginalForm(updated);

      setEditing(false);

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}

        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white">
          <div className="flex items-center gap-5">
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
              <User size={50} className="text-indigo-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">{form.name}</h1>
              <p className="opacity-90">{form.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 p-8">
          {/* Name */}

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Full Name
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4">
              <User className="text-slate-400" size={18} />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full p-3 outline-none rounded-xl ${
                  editing ? "bg-white" : "bg-slate-100 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          {/* Email */}

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Email
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4">
              <Mail className="text-slate-400" size={18} />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full p-3 outline-none rounded-xl ${
                  editing ? "bg-white" : "bg-slate-100 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          {/* Mobile */}

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Mobile Number
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4">
              <Phone className="text-slate-400" size={18} />

              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full p-3 outline-none rounded-xl ${
                  editing ? "bg-white" : "bg-slate-100 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          {/* Message */}

          <div className="md:col-span-2">
            {message && (
              <div className="mb-5 rounded-xl bg-green-50 border border-green-200 text-green-700 p-3">
                {message}
              </div>
            )}

            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
                >
                  <Save size={18} />
                  {saving ? "Updating..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    loadProfile();
                  }}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
