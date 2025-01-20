import { NewCustomer } from "@/interfaces/shipper";
import { loginOneApi } from "./axios";
export const consigneesEndpoint = "/consignees";
export const getAllconsignees = async (
  searchValues: string,
  currentPage: number,
  workplace:string,
) => {
  try {
    const response = await loginOneApi.get(
      consigneesEndpoint + `?search=${searchValues}&page=${currentPage}&workplace=${
          workplace?.toLowerCase().includes("dubai")? null : workplace
        }`
    );
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const getAllconsigneesUnPaginated = async () => {
  try {
    const response = await loginOneApi.get(consigneesEndpoint + `/unpaginated`);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const createNewConsignee = async (data: NewCustomer) => {
  try {
    const response = await loginOneApi.post(consigneesEndpoint, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
export const deleteConsignee = async (id: number) => {
  try {
    const response = await loginOneApi.delete(consigneesEndpoint + `/${id}`);
    return response.data.message;
  } catch (err) {
    console.log(err);
  }
};
export const getConsignee = async (id: number) => {
  try {
    const response = await loginOneApi.get(consigneesEndpoint + `/${id}`);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const updateShipper = async (id: number, data: NewCustomer) => {
  try {
    const response = await loginOneApi.put(consigneesEndpoint + `/${id}`, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
