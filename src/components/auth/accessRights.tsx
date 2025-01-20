"use client"
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { useSession } from "next-auth/react";
import React, { ComponentType, ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

type WithAuthorizationProps = {
  children?: ReactNode;
};
const withAuthorization = <P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[]
) => {
  const WithAuthorization: React.FC<P & WithAuthorizationProps> = (props) => {
    const { data: session }: any = useSession();
    const role = session?.role;
    const dispatch = useDispatch();
    useEffect(() => {
      if (!role || !allowedRoles.includes(role)) {
        dispatch(setPageTitle("Unauthorized"));
      }
    }, [dispatch, role, allowedRoles]);
    if (!role || !allowedRoles.includes(role)) {
      return (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <div className="bg-white text-red-400 w-fit h-fit p-6 flex flex-col gap-2">
            <h2 className="text-center">Unauthorized Access</h2>
            <p className="text-sm">
              You do not have the required permissions to access this page.
            </p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...(props as P)} />;
  };

  return WithAuthorization;
};
export const withRolesAccess = <P extends object>(
  Component: ComponentType<P>,
  roles: string[]
) => withAuthorization(Component, roles);
