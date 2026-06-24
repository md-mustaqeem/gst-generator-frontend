import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import LeftDetails from "../components/LeftDetails";
import InvoicePreview from "../components/InvoicePreview";
import Footer from "../components/Footer";
import RecentInvoices from "../components/RecentInvoices";

import { generateInvoice } from "../utils/pdfGenerator";

import {
  getBusiness,
  saveInvoice,
  getInvoicesByDate,
  updateInvoice,
  uploadPdf,
} from "../api/auth";

import {
  defaultBusiness,
  defaultCustomer,
  defaultProducts,
} from "../constants/defaults";

import useInvoice from "../hooks/useInvoice";

export default function Home() {
  const navigate = useNavigate();

  const [business, setBusiness] = useState(defaultBusiness);
  const [customer, setCustomer] = useState(defaultCustomer);
  const [products, setProducts] = useState(defaultProducts);

  const [paidAmount, setPaidAmount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const { subtotal, discountAmount, gstAmount, grandTotal } =
    useInvoice(products);

  const dueAmount = Math.max(grandTotal - (Number(paidAmount) || 0), 0);

  const [invoiceSaved, setInvoiceSaved] = useState(false);
  const [savedInvoice, setSavedInvoice] = useState(null);

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [saving, setSaving] = useState(false);

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const [selectedDate, setSelectedDate] = useState(today);

  const loadRecentInvoices = async (date = today) => {
    try {
      const response = await getInvoicesByDate(date);
      setRecentInvoices(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;

    setSelectedDate(date);

    loadRecentInvoices(date);
  };

  const handleGenerate = async () => {
    try {
      setSaving(true);
      const request = {
        customer: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
        },

        products: products.map((item) => ({
          product: item.product,
          qty: Number(item.qty),
          price: Number(item.price),
          discount: Number(item.discount),
          gst: Number(item.gst),
        })),

        subtotal: Number(subtotal),
        discountAmount: Number(discountAmount),
        gstAmount: Number(gstAmount),
        grandTotal: Number(grandTotal),

        paidAmount: Number(paidAmount),
        dueAmount: Number(dueAmount),
      };

      let response;

      // console.log("Editing Invoice ID:", editingInvoiceId);
      // console.log("Request:", request);

      if (editingInvoiceId) {
        response = await updateInvoice(editingInvoiceId, request);

        setEditingInvoiceId(null);

        alert("Invoice Updated Successfully");
      } else {
        response = await saveInvoice(request);

        alert("Invoice Saved Successfully");
      }

      setSavedInvoice(response.data);

      // ================= Generate PDF =================

      const pdf = generateInvoice({
        business,
        customer,
        products,

        subtotal,
        discountAmount,
        gstAmount,
        grandTotal,

        paidAmount,
        dueAmount,

        invoiceNo: response.data.invoiceNo,
        invoiceDate: response.data.invoiceDate,
      });

      // ================= Upload PDF =================

      // console.log("Invoice Response:", response.data);

      const formData = new FormData();

      formData.append("file", pdf.blob, pdf.fileName);

      // IMPORTANT
      formData.append("invoiceId", response.data.id);

      const uploadResponse = await uploadPdf(formData);

      setInvoiceSaved(true);

      setIsTyping(false);

      await loadRecentInvoices(selectedDate);

      handleReset();
    } catch (error) {
      alert(JSON.stringify(error.response?.data));
      setInvoiceSaved(false);

      alert("Unable to save invoice");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setCustomer({
      name: "",
      phone: "",
      email: "",
      address: "",
    });

    setProducts([
      {
        product: "",
        qty: "",
        price: "",
        discount: "",
        gst: "",
      },
    ]);

    setPaidAmount(0);
  };

  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

  const handleEdit = (invoice) => {
    setEditingInvoiceId(invoice.id);

    setCustomer({
      name: invoice.customerName,
      phone: invoice.customerPhone,
      email: invoice.customerEmail,
      address: invoice.customerAddress,
    });

    setProducts(
      invoice.items.map((item) => ({
        product: item.product,
        qty: item.qty,
        price: item.price,
        discount: item.discount,
        gst: item.gst,
      })),
    );

    setPaidAmount(invoice.paidAmount);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadBusiness();
    loadRecentInvoices(today);
  }, [navigate]);

  const loadBusiness = async () => {
    try {
      const response = await getBusiness();

      // console.log("SUCCESS", response);
      // console.log("DATA", response.data);

      setBusiness(response.data);
    } catch (error) {
    } finally {
      // console.log("FINALLY");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-14">
      <Navbar onGenerate={handleGenerate} />

      <div className="w-full max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Side */}
          <div className="lg:col-span-7">
            <LeftDetails
              customer={customer}
              setCustomer={setCustomer}
              products={products}
              setProducts={setProducts}
              subtotal={subtotal}
              gstAmount={gstAmount}
              discountAmount={discountAmount}
              grandTotal={grandTotal}
              paidAmount={paidAmount}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
              setPaidAmount={setPaidAmount}
              dueAmount={dueAmount}
              onGenerate={handleGenerate}
            />
          </div>

          {/* Right Side */}
          <div className="lg:col-span-5">
            <InvoicePreview
              business={business}
              customer={customer}
              products={products}
              subtotal={subtotal}
              discountAmount={discountAmount}
              gstAmount={gstAmount}
              grandTotal={grandTotal}
              paidAmount={paidAmount}
              dueAmount={dueAmount}
              onGenerate={handleGenerate}
              saving={saving}
              invoiceSaved={invoiceSaved}
              savedInvoice={savedInvoice}
              setCustomer={setCustomer}
              setProducts={setProducts}
              isTyping={isTyping}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        <RecentInvoices
          invoices={recentInvoices}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          handleEdit={handleEdit}
        />
      </div>

      <Footer />
    </div>
  );
}
