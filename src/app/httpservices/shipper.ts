import { NewShipper } from "@/interfaces/shipper";
import { loginOneApi } from "./axios";
export const shippersEndpoint = "/shippers";
export const getAllshippers = async (searchValues: string) => {
  const response = await loginOneApi.get(
    shippersEndpoint + `?search=${searchValues}`
  );
  return response.data.data;
};

export const createNewShipper = async (data: NewShipper) => {
  const response = await loginOneApi.post(shippersEndpoint, data);
  return response.data.message;
};
export const deleteShipper = async (id: number) => {
  const response = await loginOneApi.delete(shippersEndpoint + `/${id}`);
  return response.data.message;
};
export const getShipper = async (id: number) => {
  const response = await loginOneApi.get(shippersEndpoint + `/${id}`);
  return response.data.data;
};
export const updateShipper = async (id: number, data: NewShipper) => {
  const response = await loginOneApi.put(shippersEndpoint + `/${id}`, data);
  return response.data.message;
};
