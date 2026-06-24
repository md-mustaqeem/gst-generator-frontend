import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------- Currency ---------- */

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/* ---------- Amount in Words ---------- */

const numberToWords = (num) => {
  if (!num) return "Zero Rupees Only";

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convert = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
    if (n < 1000)
      return a[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
    if (n < 100000)
      return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);
    if (n < 10000000)
      return convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000);
    return (
      convert(Math.floor(n / 10000000)) + " Crore " + convert(n % 10000000)
    );
  };
  return convert(Math.round(num)) + " Rupees Only";
};

/* ---------- Main Function ---------- */

export const generateInvoice = ({
  business,
  customer,
  products,
  subtotal,
  discountAmount,
  gstAmount,
  grandTotal,
  paidAmount,
  dueAmount,

  invoiceNo,
  invoiceDate,

  autoPrint = false,
}) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pdfInvoiceNo = invoiceNo || `INV-${Date.now()}`;

  const pdfInvoiceDate = invoiceDate
    ? new Date(invoiceDate).toLocaleDateString("en-GB")
    : new Date().toLocaleDateString("en-GB");

  /* ==========================================================
     HEADER FUNCTION
  ========================================================== */

  const drawHeader = () => {
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageWidth, 38, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(business.name || "Your Business", 15, 15);
    doc.setFontSize(10);
    doc.text("GST TAX INVOICE", 15, 23);
    doc.text(`GSTIN : ${business.gst || "-"}`, 15, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Invoice No : ${pdfInvoiceNo}`, pageWidth - 65, 18);
    doc.text(`Date : ${pdfInvoiceDate}`, pageWidth - 65, 26);
    doc.setTextColor(0, 0, 0);
  };
  drawHeader();

  /* ==========================================================
  FROM & BILL TO
  ========================================================== */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text("FROM", 15, 45);
  doc.text("BILL TO", 115, 45);

  /* ---------- BUSINESS ---------- */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(business?.name || "-", 15, 53);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let y = 59;

  // Address
  const businessAddress = doc.splitTextToSize(
    `Address : ${business?.address || "-"}`,
    80,
  );

  doc.text(businessAddress, 15, y);
  y += businessAddress.length * 4;

  // Phone
  doc.text(`Phone : ${business?.phone || "-"}`, 15, y);
  y += 4.5;

  // Email
  doc.text(`Email : ${business?.email || "-"}`, 15, y);

  /* ---------- CUSTOMER ---------- */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(customer?.name || "-", 115, 53);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let cy = 59;

  const customerAddress = doc.splitTextToSize(
    `Address : ${customer?.address || "-"}`,
    80,
  );

  doc.text(customerAddress, 115, cy);
  cy += customerAddress.length * 4;

  doc.text(`Phone : ${customer?.phone || "-"}`, 115, cy);
  cy += 4.5;

  doc.text(`Email : ${customer?.email || "-"}`, 115, cy);

  /* ==========================================================
  PRODUCT TABLE DATA
========================================================== */

  const body = products.map((item, index) => {
    const qty = Number(item.qty) || 0;
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const gst = Number(item.gst) || 0;

    const itemSubtotal = qty * price;
    const itemDiscount = (itemSubtotal * discount) / 100;
    const taxableAmount = itemSubtotal - itemDiscount;
    const itemGST = (taxableAmount * gst) / 100;
    const total = taxableAmount + itemGST;

    return [
      index + 1,
      item.product || "-",
      qty,
      formatCurrency(price),
      `${discount}% (${formatCurrency(itemDiscount)})`,
      `${gst}% (${formatCurrency(itemGST)})`,
      formatCurrency(total),
    ];
  });

/* ==========================================================
PRODUCT TABLE
========================================================== */

  autoTable(doc, {
    startY: 80,
    head: [["S.No", "Product", "Qty", "Price", "Discount", "GST", "Total"]],
    body,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontStyle: "normal",
      fontSize: 9,
      cellPadding: 3,
      lineWidth: 0.2,
      lineColor: [220, 220, 220],
      valign: "middle",
      overflow: "linebreak",
    },

    headStyles: {
      fillColor: [5, 150, 105],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
      valign: "middle",
      cellPadding: 3,
      minCellHeight: 8,
      overflow: "linebreak",
    },

    bodyStyles: {
      textColor: [40, 40, 40],
      fontSize: 9,
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    tableWidth: "wrap",
    margin: {
      left: 12,
      right: 12,
    },
    tableWidth: "190",
    didParseCell: function (data) {
      if (
        data.section === "body" &&
        (data.column.index === 1 ||
          data.column.index === 3 ||
          data.column.index === 5)
      ) {
        data.cell.styles.halign = "center";
      }
      data.settings.margin.top = 40;
    },

    didDrawPage: () => {
      if (doc.getCurrentPageInfo().pageNumber > 1) {
        drawHeader();
      }
    },
  });

  let finalY = doc.lastAutoTable.finalY + 15;
  if (finalY > 235) {
    doc.addPage();
    drawHeader();
    finalY = 55;
  }

  /* ==========================================================
AMOUNT IN WORDS
========================================================== */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Amount In Words", 15, finalY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(numberToWords(grandTotal), 15, finalY + 6, {
    maxWidth: 100,
  });

  /* ==========================================================
  SUMMARY
  ========================================================== */

  const startX = pageWidth - 88;
  let summaryY = finalY;

  // ---------- Subtotal ----------
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  doc.text("Subtotal", startX, summaryY);
  doc.text(formatCurrency(subtotal), pageWidth - 15, summaryY, {
    align: "right",
  });

  summaryY += 8;

  // ---------- Discount ----------
  doc.setTextColor(255, 0, 0);

  doc.text("Discount", startX, summaryY);
  doc.text("- " + formatCurrency(discountAmount), pageWidth - 15, summaryY, {
    align: "right",
  });

  summaryY += 8;

  // ---------- GST ----------
  doc.setTextColor(0, 0, 0);

  doc.text("GST", startX, summaryY);
  doc.text(formatCurrency(gstAmount), pageWidth - 15, summaryY, {
    align: "right",
  });

  summaryY += 6;

  // Green Line
  doc.setDrawColor(5, 150, 105);
  doc.line(startX, summaryY, pageWidth - 15, summaryY);

  summaryY += 10;

  // ---------- Grand Total ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(5, 120, 87);

  doc.text("Grand Total", startX, summaryY);
  doc.text(formatCurrency(grandTotal), pageWidth - 15, summaryY, {
    align: "right",
  });

  summaryY += 5;

  // Black Line
  doc.setDrawColor(120);
  doc.line(startX, summaryY, pageWidth - 15, summaryY);

  summaryY += 10;

  // ---------- Paid ----------
  doc.setFontSize(13);
  doc.setTextColor(37, 99, 235);

  doc.text("Paid Amount", startX, summaryY);
  doc.text(formatCurrency(paidAmount), pageWidth - 15, summaryY, {
    align: "right",
  });

  summaryY += 10;

  // ---------- Due ----------
  doc.setTextColor(234, 88, 12);

  doc.text("Due Amount", startX, summaryY);
  doc.text(formatCurrency(dueAmount), pageWidth - 15, summaryY, {
    align: "right",
  });

  doc.setTextColor(0, 0, 0);

  /* ==========================================================
PAGE NUMBERS
========================================================== */

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, {
      align: "center",
    });
  }

  /* ==========================================================
SAVE PDF
========================================================== */
  /* ==========================================================
GENERATE PDF
========================================================== */

  // PDF Blob create karo
  const pdfBlob = doc.output("blob");

  // Sirf Print button ke liye
  if (autoPrint) {
    doc.autoPrint();

    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, "_blank");
  }

  // Blob return karo (Upload ke liye)
  return {
    doc,
    blob: pdfBlob,
    fileName: `${pdfInvoiceNo}.pdf`,
  };
};
