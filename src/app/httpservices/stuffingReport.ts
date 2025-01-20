import { NewStuffingItem } from "@/interfaces/stuffingItem";
import { loginOneApi } from "./axios";
import { StuffingReport } from "@/interfaces/stuffingreport";
export const stuffingReportEndpoint = "/stuffingreports";
export const getAllStuffingReports = async (
  searchValues: string,
  FilterValue: string,
  currentPage: number,
  workplace: string
) => {
  const response = await loginOneApi.get(
    stuffingReportEndpoint +
      `?search=${searchValues}&page=${currentPage}&filter=${FilterValue}&workplace=${
        workplace?.toLowerCase().includes("dubai") ? null : workplace
      }`
  );
  return response.data.data;
};
export const createStuffingReports = async (data: StuffingReport) => {
  const response = await loginOneApi.post(stuffingReportEndpoint, data);
  return { message: response.data.message, status: response.data.status };
};
export const deleteStuffingReports = async (id: number) => {
  const response = await loginOneApi.delete(stuffingReportEndpoint + `/${id}`);
  return { message: response.data.message, status: response.data.status };
};
export const getStuffingReportsItems = async (id: number) => {
  const response = await loginOneApi.get(stuffingReportEndpoint + `/${id}`);
  return response.data.data;
};
export const getStuffingReport = async (id: number) => {
  const response = await loginOneApi.get(stuffingReportEndpoint + `/${id}/report`);
  return response.data.data;
};
export const updateStuffingReport = async (
  id: number,
  data: StuffingReport
) => {
  const response = await loginOneApi.put(stuffingReportEndpoint + `/${id}`, data);
  return { message: response.data.message, status: response.data.status };
};
export const generateStuffingReport = async (id: number) => {
  const response = await loginOneApi.put(
    stuffingReportEndpoint + `/${id}/generate/${id}`
  );
  return { message: response.data.message, status: response.data.status };
};
export const getStuffingReportsItemsDetail = async (
  id: number,
  itmId: number
) => {
  const response = await loginOneApi.get(
    stuffingReportEndpoint + `/${id}/detail/${itmId}`
  );
  return response.data.data;
};
export const updateStuffingReportsItemsDetail = async (
  id: number,
  itmId: number,
  data: NewStuffingItem
) => {
  const response = await loginOneApi.put(
    stuffingReportEndpoint + `/${id}/detail/${itmId}`,
    data
  );
  return { message: response.data.message, status: response.data.status };
};
export const deleteStuffingReportsItemsDetail = async (
  id: number,
  itmId: number
) => {
  const response = await loginOneApi.delete(
    stuffingReportEndpoint + `/${id}/detail/${itmId}`
  );
  return { message: response.data.message, status: response.data.status };
};
export const addStuffingReportsItems = async (
  id: number,
  data: NewStuffingItem
) => {
  const response = await loginOneApi.post(stuffingReportEndpoint + `/${id}`, data);
  return { message: response.data.message, status: response.data.status };
};

export const getStuffingReportsItemsInvoice = async (
  Itemsid: number,
  invoiceId: number
) => {
  try {
    const response = await loginOneApi.get(
      stuffingReportEndpoint + `/${Itemsid}/invoice/${invoiceId}`
    );
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const generateInvoice = async (
  Itemsid: number,
  invoiceId: number,
  data: { vat: number; totalAmountInWords: string; detailsId: string }
) => {
  try {
    const response = await loginOneApi.post(
      stuffingReportEndpoint + `/${Itemsid}/invoice/${invoiceId}`,
      data
    );
    return response.data.message;
  } catch (err) {
    console.log(err);
  }
};
export const PayInvoice = async (
  Itemsid: number,
  invoiceId: number,
  data: { amountPaid: number; recievedBy: string }
) => {
  try {
    const response = await loginOneApi.put(
      stuffingReportEndpoint + `/${Itemsid}/invoice/${invoiceId}`,
      data
    );
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
export const getAllContainers = async (
  searchValues: string,
  currentPage: number,
  workplace: string,
) => {
  try {
    const response = await loginOneApi.get(
      stuffingReportEndpoint +
        `/all?search=${searchValues}&page=${currentPage}&workplace=${
          workplace?.toLowerCase().includes("dubai") 
            ? null
            : workplace
        }`
    );
    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};
