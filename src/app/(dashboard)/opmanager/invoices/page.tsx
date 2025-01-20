"use client";
import useSWR from "swr";
import { FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Suspense, useEffect, useState } from "react";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { headers } from "@/app/tableHeaders/invoices";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Invoices from "@/components/dashboard/pages/invoices";
import { getAllinvoicesByLocation, invoiceEndpoint } from "@/app/httpservices/invoices";
import { invoice } from "@/interfaces/invoice";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import useDebounce from "@/app/utilities/debouce";
import Paginator from "@/components/pagination/paginator";
import exportDataInExcel from "@/app/utilities/exportdata";
import usePagination from "@/app/utilities/usePagination";
import { useSession } from "next-auth/react";

const Page = () => {
  const dispatch = useDispatch();
  const currentPath = usePathname();
  const session: any = useSession();
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const searchValue = searchParams?.get("search") || "";
  const [search, setSearch] = useState(searchValue);
  const searchValues = useDebounce(search, 1000);
  const userId = session?.data?.id;
  const [currentPage, setCurrentPage] = useState(1);
  const activePage = searchParams?.get("page");

  // Use a conditional key for useSWR based on userId
  const { data, isLoading, error } = useSWR(
    userId ? [invoiceEndpoint, searchValues, currentPage, userId] : null,
    () => userId ? getAllinvoicesByLocation(searchValues, currentPage, Number(userId)) : null,
    {
      onSuccess: (data: invoice[]) =>
        data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
    }
  );

  const { handlePageChange, handleNextPage, handlePreviousPage } = usePagination(data?.invoices, currentPage);

  useEffect(() => {
    dispatch(setPageTitle("Invoices"));
  }, [dispatch]);

  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (searchParams?.get("export")) {
      exportDataInExcel(
        data?.invoices,
        headers,
        `Invoices-page ${currentPage}`
      );
      router.back();
    }
  }, [searchParams, data?.invoices, router, currentPage]);

  useEffect(() => {
    if (activePage) {
      setCurrentPage(activePage);
    }
  }, [activePage]);

  const handleOpenInvoice = async (id: number | string) => {
    router.push(`${currentPath}/${id}`);
  };

  const actions = [{ icon: <FaEye />, Click: handleOpenInvoice, name: "view" }];

  if (data?.invoices) {
    return (
      <div className="w-full">
        <Invoices headers={headers} data={data?.invoices} action={actions} />
        <div className="flex justify-end w-full mt-2">
          <Paginator
            activePage={currentPage}
            totalPages={data?.count}
            onPageChange={handlePageChange}
            onPreviousPageChange={handlePreviousPage}
            onNextPageChange={handleNextPage}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorSection message={error.message}/>;
  }
};

const SuspensePage = () => (
  <Suspense fallback={<Loader />}>
    <Page />
  </Suspense>
);

export default SuspensePage;
