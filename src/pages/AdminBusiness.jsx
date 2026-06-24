import { useEffect, useState } from "react";
import BusinessDetails from "../components/BusinessDetails";
import { saveBusiness, getBusiness, updateBusiness } from "../api/auth";

const defaultBusiness = {
  name: "",
  gst: "",
  phone: "",
  email: "",
  address: "",
};

export default function AdminBusiness() {
  const [business, setBusiness] = useState(defaultBusiness);
  const [loading, setLoading] = useState(false);

  // Load Business Details
  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      const response = await getBusiness();

      if (response.data) {
        setBusiness(response.data);
      }
    } catch (error) {
      console.log("No Business Found");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (business.id) {
        await updateBusiness(business);
        alert("Business Updated Successfully");
      } else {
        await saveBusiness(business);
        alert("Business Saved Successfully");
      }

      loadBusiness();
    } catch (error) {
      console.error(error);
      alert("Unable to Save Business");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBusiness(defaultBusiness);
  };

  return (
    <div className="max-w-5xl  p-1">
      <h2 className="text-3xl font-bold text-white mb-6">Business Details</h2>

      <BusinessDetails business={business} onChange={setBusiness} />

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Business"}
        </button>
      </div>
    </div>
  );
}
