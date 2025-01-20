"use client";
import useSWR from "swr";
import { FaEye } from "react-icons/fa";
import { containerListHeaders } from "@/app/tableHeaders/staffingReports";
import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { Suspense, useEffect, useState, FC } from "react";
import {
  getAllContainers,
  stuffingReportEndpoint,
} from "@/app/httpservices/stuffingReport";
import { StuffingReport } from "@/interfaces/stuffingreport";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import { useSession } from "next-auth/react";
import useDebounce from "@/app/utilities/debouce";
import Paginator from "@/components/pagination/paginator";
import usePagination from "@/app/utilities/usePagination";
// import { withRolesAccess } from "@/components/auth/accessRights";
import ContainersList from "@/components/dashboard/pages/containersList";
import { loginOneApi } from "@/app/httpservices/axios";
const Page = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const searchParams: any = useSearchParams();
  const dispatch = useDispatch();
  const session: any = useSession();
  const role = session?.data?.role;
  const userId = session?.data?.id;
  const workPlace=session?.data?.workCountry;
  const token = session?.data?.accessToken;
  const searchValue = searchParams?.get("search") || "";
  const [search, setSearch] = useState(searchValue);
  const searchValues = useDebounce(search, 1000);
  const activePage = searchParams?.get("page");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading, error } = useSWR(
    [stuffingReportEndpoint, searchValues, currentPage,token],
    () => getAllContainers(searchValues, currentPage,workPlace)
  );
  useEffect(() => {
    dispatch(setPageTitle("Containers - Invoices"));
    loginOneApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [dispatch]);
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);
  const { handlePageChange, handleNextPage, handlePreviousPage } =
    usePagination(data?.customers, currentPage);
  useEffect(() => {
    if (activePage) {
      setCurrentPage(activePage);
    }
  }, [activePage]);
  const handleOpenContainer = async (id: number | string) => {
    router.push(`${currentPath}/${id}/invoices`);
  };
  const actions = [
    { icon: <FaEye />, Click: handleOpenContainer, name: "view" },
  ];
  if (data?.containers) {
    const containersList =
      role == "operation manager" && Array.isArray(data?.containers)
        ? data?.containers.filter(
            (stuff: StuffingReport) => stuff.operatorId == userId
          )
        : data?.containers;
    return (
      <div className="w-full">
        <ContainersList
          headers={containerListHeaders}
          data={containersList}
          action={actions}
        />
        <div className="flex justify-end w-full mt-2">
          <Paginator
            activePage={currentPage}
            totalPages={data?.count || 1}
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
const SuspensePage:FC= () => (
  <Suspense fallback={<Loader />}>
    <Page />
  </Suspense>
);

export default SuspensePage;
