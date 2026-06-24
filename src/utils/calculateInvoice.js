export function calculateInvoice(products) {
  let subtotal = 0;
  let discountAmount = 0;
  let gstAmount = 0;
  let grandTotal = 0;

  products.forEach((item) => {
    const qty = Number(item.qty) || 0;
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const gst = Number(item.gst) || 0;

    const itemSubtotal = qty * price;
    const itemDiscount = (itemSubtotal * discount) / 100;
    const taxableAmount = itemSubtotal - itemDiscount;
    const itemGST = (taxableAmount * gst) / 100;
    const itemTotal = taxableAmount + itemGST;

    subtotal += itemSubtotal;
    discountAmount += itemDiscount;
    gstAmount += itemGST;
    grandTotal += itemTotal;
  });

  return {
    subtotal,
    discountAmount,
    gstAmount,
    grandTotal,
  };
}
