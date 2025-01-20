import { loginOneApi } from "./axios";
export const dashboardEndpoint = "/dashboardInfo";
export const getDashboardinfo = async (
  startDate: string,
  endDate: string,
  workplace: string
) => {
  try {
    const response = await loginOneApi.get(
      dashboardEndpoint +
        `?startDate=${startDate}&endDate=${endDate}&workplace=${
          workplace?.toLowerCase().includes("dubai") ? null : workplace
        }`
    );
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
