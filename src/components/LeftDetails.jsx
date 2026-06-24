import CustomerDetails from "./CustomerDetails";
import Products from "./Products";
import Summary from "./Summary";

export default function LeftDetails({
  business,
  setBusiness,

  customer,
  setCustomer,

  products,
  setProducts,

  subtotal,
  discountAmount,
  gstAmount,
  grandTotal,

  paidAmount,
  setPaidAmount,
  dueAmount,

  onGenerate,

  // NEW
  isTyping,
  setIsTyping,
}) {
  return (
    <div className="flex flex-col gap-5">
      <CustomerDetails
        customer={customer}
        onChange={setCustomer}
        setIsTyping={setIsTyping}
      />

      <Products
        products={products}
        onChange={setProducts}
        setIsTyping={setIsTyping}
      />

      <Summary
        subtotal={subtotal}
        gstAmount={gstAmount}
        discountAmount={discountAmount}
        grandTotal={grandTotal}
        paidAmount={paidAmount}
        setPaidAmount={setPaidAmount}
        dueAmount={dueAmount}
        onGenerate={onGenerate}
      />
    </div>
  );
}
