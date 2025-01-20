import { NewSite } from "@/interfaces/sites";
import { loginOneApi } from "./axios";
export const deliverySitesEndpoint = "/deliverysites";
export const getAllsites = async (
  searchValues: string,
  currentPage: number
) => {
  try {
    const response = await loginOneApi.get(
      deliverySitesEndpoint + `?search=${searchValues}&page=${currentPage}`
    );
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const getAllsitesUnpaginated = async () => {
  try {
    const response = await loginOneApi.get(deliverySitesEndpoint + `/unpaginated`);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};

export const createNewSite = async (data: NewSite) => {
  try {
    const response = await loginOneApi.post(deliverySitesEndpoint, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
export const deleteSite = async (id: number) => {
  try {
    const response = await loginOneApi.delete(deliverySitesEndpoint + `/${id}`);
    return response.data.message;
  } catch (err) {
    console.log(err);
  }
};
export const getSite = async (id: number) => {
  try {
    const response = await loginOneApi.get(deliverySitesEndpoint + `/${id}`);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const updateSite = async (id: number, data: NewSite) => {
  try {
    const response = await loginOneApi.put(deliverySitesEndpoint + `/${id}`, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
