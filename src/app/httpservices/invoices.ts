import { loginOneApi } from "./axios";
export const invoiceEndpoint = "/invoices";
export const getAllinvoices = async (
  contId:number,
  searchValues: string,
  currentPage: number
) => {
  const response = await loginOneApi.get(
    invoiceEndpoint + `?contid=${contId}&search=${searchValues}&page=${currentPage}`
  );
  return response.data.data;
};
export const getAllinvoicesByLocation = async (
  searchValues: string,
  currentPage: number,
  id: number
) => {
  try {
    const response = await loginOneApi.get(
      invoiceEndpoint +
        `/location/${id}?search=${searchValues}&page=${currentPage}`
    );
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const getInvoice = async (id: number) => {
  try {
    const response = await loginOneApi.get(invoiceEndpoint + "/" + id);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const updateInvoice = async (id: number) => {
  try {
    const response = await loginOneApi.put(invoiceEndpoint + "/" + id);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
