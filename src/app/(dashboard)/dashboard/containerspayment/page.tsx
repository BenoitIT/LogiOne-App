"use client";
import useSWR from "swr";
import { useEffect, Suspense, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import ContainersPayments from "@/components/dashboard/pages/containersPayment";
import { contPymentheaders } from "@/app/tableHeaders/containerPayment";
import { FaEye } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/appComponents/pageBlocks/loader";
import {
  containersPyamentEndpoint,
  getAllContainerPaymentPerPlace,
} from "@/app/httpservices/containerPayment";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import { useSearchParams } from "next/navigation";
import useDebounce from "@/app/utilities/debouce";
import { withRolesAccess } from "@/components/auth/accessRights";
import Paginator from "@/components/pagination/paginator";
import usePagination from "@/app/utilities/usePagination";
import { useSession } from "next-auth/react";
const Page = () => {
  const dispatch = useDispatch();
  const searchParam = useSearchParams();
  const currentPath = usePathname();
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const session: any = useSession();
  const workPlace=session?.data?.workCountry;
  const locationCode = searchParam?.get("location") || "KGL";
  const searchValue = searchParams?.get("search") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const activePage = searchParams?.get("page");
  const [search, setSearch] = useState(searchValue);
  const searchValues = useDebounce(search, 1000);
  const { data, isLoading, error } = useSWR(
    [containersPyamentEndpoint, locationCode, searchValues],
    () =>
      getAllContainerPaymentPerPlace(locationCode, searchValues, currentPage,workPlace)
  );
  const { handlePageChange, handleNextPage, handlePreviousPage } =
    usePagination(data?.data, currentPage);
  useEffect(() => {
    dispatch(setPageTitle("Payments"));
  }, [dispatch]);
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);
  useEffect(() => {
    if (activePage) {
      setCurrentPage(Number(activePage));
    }
  }, [activePage]);
  const handleView = async (id: number) => {
    router.push(`${currentPath}/${id}`);
  };
  const actions = [
    { icon: <FaEye className="ml-4" />, Click: handleView, name: "view" },
  ];
  if (data?.data) {
    return (
      <Suspense fallback={<Loader />}>
        <ContainersPayments
          headers={contPymentheaders}
          data={data?.data}
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
      </Suspense>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    <ErrorSection message={error.message}/>;
  }
};
export default withRolesAccess(Page, [
  "admin",
  "finance",
  "head of finance",
]) as React.FC;
