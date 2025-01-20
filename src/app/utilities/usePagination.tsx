import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const usePagination = (data: any, currentPage = 1) => {
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const handlePageChange = (pageNumber: number) => {
    router.push(`?${createQueryString("page", pageNumber.toString())}`);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      router.push(
        `?${createQueryString("page", (currentPage - 1).toString())}`
      );
    }
  };
  const handleNextPage = () => {
    if (Array.isArray(data) && data.length > currentPage) {
      router.push(
        `?${createQueryString(
          "page",
          (Number(currentPage) + Number(1)).toString()
        )}`
      );
    }
  };
  return { handlePageChange, handleNextPage, handlePreviousPage };
};
export default usePagination;
