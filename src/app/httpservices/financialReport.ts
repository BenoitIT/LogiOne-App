import { loginOneApi } from "./axios";
export const financialReportEndpoint = "/financialreport";
export const getFinancialReport = async (
  workplace: string,
  searchValues?: string,
  currentPage?: number,
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await loginOneApi.get(
      financialReportEndpoint +
        `?search=${searchValues}&page=${currentPage}&startDate=${startDate}&endDate=${endDate}&workplace=${
          workplace?.toLowerCase().includes("dubai") ? null : workplace
        }`
    );
    return { data: response.data.data, count: response.data.count };
  } catch (err) {
    console.log(err);
  }
};
export const getFinancialReportchart = async (
  workplace: string,
) => {
  try {
    const response = await loginOneApi.get(
      financialReportEndpoint +
        `/chart?workplace=${
          workplace?.toLowerCase().includes("dubai") 
            ? null
            : workplace
        }`
    );
    return { chart: response.data?.chart };
  } catch (err) {
    console.log(err);
  }
};
