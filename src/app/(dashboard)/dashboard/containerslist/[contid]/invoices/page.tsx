"use client";
import useSWR, { mutate } from "swr";
import { FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Suspense, useEffect, useState } from "react";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { headers } from "@/app/tableHeaders/invoices";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Invoices from "@/components/dashboard/pages/invoices";
import {
  getAllinvoices,
  invoiceEndpoint,
  updateInvoice,
} from "@/app/httpservices/invoices";
import { invoice } from "@/interfaces/invoice";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import useDebounce from "@/app/utilities/debouce";
import Paginator from "@/components/pagination/paginator";
import exportDataInExcel from "@/app/utilities/exportdata";
import usePagination from "@/app/utilities/usePagination";
import { withRolesAccess } from "@/components/auth/accessRights";
import { MdLibraryAddCheck } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const Page = () => {
  const dispatch = useDispatch();
  const param = useParams();
  const session: any = useSession();
  const currentPath = usePathname();
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const searchValue = searchParams?.get("search") || "";
  const role = session?.data?.role;
  const contId = param?.contid;
  const [search, setSearch] = useState(searchValue);
  const searchValues = useDebounce(search, 1000);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowId, setRowId] = useState<any>();
  const activePage = searchParams?.get("page");
  const { data, isLoading, error } = useSWR(
    [invoiceEndpoint, searchValues, currentPage, contId],
    () => getAllinvoices(Number(contId), searchValues, currentPage),
    {
      onSuccess: (data: invoice[]) =>
        data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
    }
  );
  const { handlePageChange, handleNextPage, handlePreviousPage } =
    usePagination(data?.invoices, currentPage);
  useEffect(() => {
    dispatch(
      setPageTitle(`${data?.invoices[0]?.containerId ?? ""}` + `-` + "Invoices")
    );
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
  const handleApprove = async (id: number) => {
    setRowId(id);
  };
  const handleApprovePayment = async (id: number) => {
    try {
      const response = await updateInvoice(id);
      if (response?.status == 200) {
        toast.success(response?.message);
        mutate(invoiceEndpoint);
        window.location.reload();
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve this payment");
    }
  };
  const handleOpenRealiseLetter = async (id: number | string) => {
    router.push(`${currentPath}/releaseletter/${id}`);
  };
  const actions = [
    { icon: <FaEye />, Click: handleOpenInvoice, name: "view" },
    {
      icon: (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <MdLibraryAddCheck
              className={
                role == "head of finance" ? "text-blue-900 text-base" : "hidden"
              }
            />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className=" text-white">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-white opacity-65">
                This action cannot be undone. This will approve the payment and
                release letter will be prepared.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className=" text-white">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleApprovePayment(rowId)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
      Click: handleApprove,
      name: "Approve payment",
    },
    {
      icon: (
        <IoMdDoneAll
          className={role == "head of finance" ? "text-blue-900" : "hidden"}
        />
      ),
      Click: handleOpenRealiseLetter,
      name: "View release letter",
    },
  ];
  if (data?.invoices) {
    return (
      <div className="w-full">
        <Invoices headers={headers} data={data?.invoices} action={actions} />
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
    return <ErrorSection />;
  }
};

const SuspensePage = () => (
  <Suspense fallback={<Loader />}>
    <Page />
  </Suspense>
);

export default withRolesAccess(SuspensePage, [
  "finance",
  "admin",
  "head of finance",
]) as React.FC;
