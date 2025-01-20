import { NewSite } from "@/interfaces/sites";
import { loginOneApi } from "./axios";
export const deliveryEndpoint = "/deliveries";
export const getAlldeliveries = async (
  searchValues: string,
  currentPage: number
) => {
  try {
    const response = await loginOneApi.get(
      deliveryEndpoint + `?search=${searchValues}&page=${currentPage}`
    );
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const getAllDeliveriesUnpaginated = async () => {
  try {
    const response = await loginOneApi.get(deliveryEndpoint + `/unpaginated`);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const getDelivery = async (id: number) => {
  try {
    const response = await loginOneApi.get(deliveryEndpoint + `/${id}`);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const createNewDelivery = async (data: NewSite) => {
  try {
    const response = await loginOneApi.post(deliveryEndpoint, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
export const deleteDelivery = async (id: number) => {
  try {
    const response = await loginOneApi.delete(deliveryEndpoint + `/${id}`);
    return response.data.message;
  } catch (err) {
    console.log(err);
  }
};
export const updateDelivery = async (id: number, data: NewSite) => {
  try {
    const response = await loginOneApi.put(deliveryEndpoint + `/${id}`, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
