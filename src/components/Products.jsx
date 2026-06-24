import { Package, Plus } from "lucide-react";
import ProductRow from "./ProductRow";

export default function Products({ products, onChange, setIsTyping }) {
  const update = (index, key, value) => {
    setIsTyping(true);

    const updated = [...products];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    onChange(updated);
  };

  const addProduct = () => {
    setIsTyping(true);

    onChange([
      ...products,
      {
        product: "",
        qty: "",
        price: "",
        gst: "",
      },
    ]);
  };

  const deleteProduct = (index) => {
    setIsTyping(true);

    if (products.length === 1) return;

    const updated = [...products];
    updated.splice(index, 1);

    onChange(updated);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <Package size={20} className="text-blue-600" />
        </div>

        <h2 className="text-lg font-semibold text-slate-900">Products</h2>
      </div>

      {/* Product List */}
      {products.map((item, index) => (
        <ProductRow
          key={index}
          item={item}
          index={index}
          onChange={update}
          onDelete={deleteProduct}
        />
      ))}

      {/* Add Button */}
      <button
        onClick={addProduct}
        className="mt-3 flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-slate-100"
      >
        <Plus size={16} />
        Add Product
      </button>
    </div>
  );
}
