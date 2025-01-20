"use client";

import useSWR, { mutate } from "swr";
import { usersBaseEndpoint as cacheKey, loginOneApi } from "@/app/httpservices/axios";
import { headers } from "@/app/tableHeaders/users";
import { FaEdit, FaTrash } from "react-icons/fa";
import Staff from "@/components/dashboard/pages/staff";
import { useDispatch } from "react-redux";
import { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { deleteUser, getAllUsers } from "@/app/httpservices/users";
import { NewStaff } from "@/interfaces/staff";
import { toast } from "react-toastify";
import Loader from "@/appComponents/pageBlocks/loader";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import { useSession } from "next-auth/react";
import useDebounce from "@/app/utilities/debouce";
import exportDataInExcel from "@/app/utilities/exportdata";
import { withRolesAccess } from "@/components/auth/accessRights";
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
  const router = useRouter();
  const session: any = useSession();
  const userId = session?.data?.id;
  const role = session?.data?.role;
  const currentpath: string = usePathname()!;
  const searchParams: any = useSearchParams();
  const searchValue = searchParams?.get("search") || "";
  const [search, setSearch] = useState(searchValue);
  const [rowId, setRowId] = useState<any>();
  const searchValues = useDebounce(search, 1000);
  const workPlace = session?.data?.workCountry;
  const token = session?.data?.accessToken;
  const {
    data: staff,
    isLoading,
    error,
  } = useSWR([cacheKey, searchValues, token], () => getAllUsers(searchValues), {
    onSuccess: (data: NewStaff[]) =>
      data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
  });
  useEffect(() => {
    dispatch(setPageTitle("Staff"));
    loginOneApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [dispatch]);
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);
  useEffect(() => {
    if (searchParams?.get("export")) {
      exportDataInExcel(staff, headers, "Staff");
      router.back();
    }
  }, [searchParams, staff, router]);
  const handleEdit = async (id: number) => {
    router.push(`${currentpath}/${id}`);
  };
  const handleDelete = async (id: number) => {
    setRowId(id);
  };
  const handleConfirmDelete = async (id: number) => {
    try {
      const message = await deleteUser(id);
      toast.success(message);
      mutate(cacheKey);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete this staff.");
    }
  };
  const actions = [
    {
      icon: (
        <FaEdit
          className={
            role !== "admin" || !workPlace?.toLowerCase().includes("rwanda")
              ? "hidden"
              : ""
          }
        />
      ),
      Click: handleEdit,
    },
    {
      icon: (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <FaTrash
              className={
                role !== "admin" || !workPlace?.toLowerCase().includes("rwanda")
                  ? "hidden"
                  : ""
              }
            />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className=" text-white">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-white opacity-65">
                This action cannot be undone. This will permanently delete user
                account and any access of their access to the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className=" text-white">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleConfirmDelete(rowId);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
      Click: handleDelete,
      name: "delete",
    },
  ];
  if (staff) {
    const filteredStaff = Array.isArray(staff)
      ? staff?.filter((user: NewStaff) => user.id != userId)
      : staff;
    return <Staff headers={headers} data={filteredStaff} action={actions} />;
  }
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorSection message={error.message} />;
  }
};

const SuspensePage = () => (
  <Suspense fallback={<Loader />}>
    <Page />
  </Suspense>
);

export default withRolesAccess(SuspensePage, ["admin", "senior operation manager"]) as React.FC;
