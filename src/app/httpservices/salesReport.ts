import { loginOneApi } from "./axios";
export const reportEndpoint = "/report";
export const getSalesReport = async (startDate: string, endDate: string) => {
  try {
    const response = await loginOneApi.get(
      reportEndpoint + `?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
export const getSalesReportFromSingleAgent = async (
  startDate: string,
  endDate: string,
  id: number
) => {
  try {
    const response = await loginOneApi.get(
      reportEndpoint + `/${id}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
