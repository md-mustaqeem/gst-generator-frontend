import api from "./api";

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

// Send OTP
export const forgotPassword = (data) => {
  return api.post("/auth/forgot-password", data);
};

// Verify OTP
export const verifyOtp = (data) => {
  return api.post("/auth/verify-otp", data);
};

// Reset Password
export const resetPassword = (data) => {
  return api.post("/auth/reset-password", data);
};

// =============================
// Email OTP Login
// =============================

export const sendEmailLoginOtp = (data) => {
  return api.post("/auth/login/email/send-otp", data);
};

export const verifyEmailLoginOtp = (data) => {
  return api.post("/auth/login/email/verify-otp", data);
};

// =============================
// Mobile OTP Login
// =============================

export const sendMobileLoginOtp = (data) => {
  return api.post("/auth/login/mobile/send-otp", data);
};

export const verifyMobileLoginOtp = (data) => {
  return api.post("/auth/login/mobile/verify-otp", data);
};

//get profile and update profile


export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put("/auth/profile", data);
  return response.data;
};

// =============================
// Business APIs
// =============================

// Save Business
export const saveBusiness = (data) => {
  return api.post("/business/saveBusiness", data);
};

// Get Logged In User Business
export const getBusiness = () => {
  return api.get("/business/getBusiness");
};

// Update Business
export const updateBusiness = (data) => {
  return api.put("/business/updateBusiness", data);
};

// ================= Invoice =================

export const saveInvoice = (data) => api.post("/invoices/saveInvoice", data);

export const getAllInvoice = () => api.get("/invoices/getAllInvoice");

export const getInvoiceById = (id) => api.get(`/invoices/getInvoice/${id}`);

export const deleteInvoice = (id) =>
  api.delete(`/invoices/deleteInvoice/${id}`);

//recent invoice

export const getInvoicesByDate = (date) =>
  api.get(`/invoices/by-date?date=${date}`);

//dashboard

export const getDashboard = () => api.get("/invoices/dashboard");

// ================= Customers =================

export const getAllCustomers = () => api.get("/customers/getAllCustomer");

export const getCustomerById = (id) => api.get(`/customers/${id}`);

export const updatePayment = (id, dueAmount) =>
  api.put(`/invoices/updatePayment/${id}`, {
    dueAmount,
  });

export const updateInvoice = (id, data) =>
  api.put(`/invoices/updateInvoice/${id}`, data);

export const uploadPdf = (formData) =>
  api.post("/pdf/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
