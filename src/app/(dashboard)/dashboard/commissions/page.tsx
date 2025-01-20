"use client";
import useSWR, { mutate } from "swr";
import { useEffect } from "react";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { useDispatch } from "react-redux";
import CommissionSection from "@/components/dashboard/pages/commission";
import { commissionsHeaders } from "@/app/tableHeaders/commisions";
import { FaCcAmazonPay } from "react-icons/fa6";
import { useState } from "react";
import {
  commisionsEndpoint,
  getAllCommissions,
  updateCommisionInfo,
} from "@/app/httpservices/commision";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import useDebounce from "@/app/utilities/debouce";
import { withRolesAccess } from "@/components/auth/accessRights";
import Paginator from "@/components/pagination/paginator";
import usePagination from "@/app/utilities/usePagination";
import { loginOneApi } from "@/app/httpservices/axios";
const Page = () => {
  const dispatch = useDispatch();
  const session: any = useSession();
  const token = session?.data?.accessToken;
  const currentUserName = session?.data?.firstname;
  const searchParams = useSearchParams();
  const searchValue = searchParams?.get("search") || "";
  const [search, setSearch] = useState(searchValue);
  const searchValues = useDebounce(search, 1000);
  const [selectedCommision, setSelectedComm] = useState<number>();
  const [amountToPay, setAmountToPay] = useState<number>();
  const [disable, setDisable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const activePage = searchParams?.get("page");
  const { data, isLoading, error } = useSWR(
    [commisionsEndpoint, searchValues, currentPage,token],
    () => getAllCommissions(searchValues, currentPage)
  );
  const { handlePageChange, handleNextPage, handlePreviousPage } =
    usePagination(data?.data, currentPage);
  useEffect(() => {
    dispatch(setPageTitle("Commission debursement"));
    loginOneApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [dispatch]);
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);
  useEffect(() => {
    if (activePage) {
      setCurrentPage(Number(activePage));
    }
  }, [activePage]);
  const handlePay = async (id: number) => {
    setSelectedComm(id);
  };
  const handleUpdateCommissionInfo = async () => {
    setDisable(true);
    if (selectedCommision) {
      const payload = {
        amountPaid: Number(amountToPay) ?? 0,
        paidBy: currentUserName,
      };
      const data = await updateCommisionInfo(selectedCommision, payload);
      if (data?.status == 200) {
        toast.success(data?.message);
        setAmountToPay(0);
        mutate(commisionsEndpoint);
      } else {
        toast.error(data?.message);
      }
    }
    setDisable(false);
  };
  const actions = [
    {
      icon: (
        <Popover>
          <PopoverTrigger asChild>
            <span>
              <FaCcAmazonPay className="text-2xl ml-4 text-blue-900" />
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold leading-none text-sm uppercase">
                  Pay commission
                </h4>
                <p className="text-sm text-muted-foreground">
                  Set the amount of money to pay
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Amount paid </Label>
                  <Input
                    id="amount"
                    type="number"
                    className="col-span-2 h-8"
                    onChange={(e) => setAmountToPay(Number(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4 mt-2">
                  <Button
                    className="h-8 disabled:cursor-not-allowed"
                    onClick={handleUpdateCommissionInfo}
                    disabled={disable}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ),
      Click: handlePay,
    },
  ];
  if (data?.data) {
    return (
      <div className="w-full">
        <CommissionSection
          headers={commissionsHeaders}
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
export default withRolesAccess(Page, [
  "finance",
  "admin",
  "head of finance",
]) as React.FC;
