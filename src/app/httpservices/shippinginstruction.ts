import { instruction } from "@/interfaces/instruction";
import { loginOneApi } from "./axios";
export const shippinginstructionEndpoint = "/shippinginstruction";
export const getAllshippinginstructions = async (
  contId:number,
  searchValue?: string,
  pageNum?: number
) => {
  try {
    const response = await loginOneApi.get(
      shippinginstructionEndpoint + `?contid=${contId}&search=${searchValue}&page=${pageNum}`
    );
    return { data: response.data.data, count: response.data.count };
  } catch (err) {
    console.log(err);
  }
};
export const getSingleShippinginstruction = async (id: number) => {
  try {
    const response = await loginOneApi.get(`${shippinginstructionEndpoint}/${id}`);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const getShippinginstructioninLocation = async (id: number,searchValue:string,pageNum?: number) => {
  try {
    const response = await loginOneApi.get(
      `${shippinginstructionEndpoint}/location/${id}?search=${searchValue}&page=${pageNum}`
    );
    return {data: response.data.data, count: response.data.count };
  } catch (err) {
    console.log(err);
  }
};
export const updateShippinginstruction = async (
  id: number,
  data: instruction
) => {
  try {
    const response = await loginOneApi.put(
      `${shippinginstructionEndpoint}/${id}`,
      data
    );
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};
