import { axiosGestion } from './api';

export const getMyInvoices = () => axiosGestion.get('/invoices/myInvoices');

export const getInvoiceById = (id) => axiosGestion.get(`/invoices/${id}`);

export const downloadInvoicePdf = (id) =>
  axiosGestion.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
