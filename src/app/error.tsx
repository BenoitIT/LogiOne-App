"use client";

import { useEffect } from "react";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console?.error(error);
  }, [error]);
  return (
    <div className="bg-grey-200 w-full h-[100vh] flex justify-center items-center p-auto">
      <div className="bg-white shadow-md py-[8vh] px-[2vw] rounded-md flex flex-col justify-center gap-3">
        <h2>{error?.message}</h2>
        {!error?.message.includes("access this page") ? (
          <button
            className="bg-blue-900 p-2 text-white rounded text-sm"
            onClick={() => {
              reset();
              window?.location.reload();
            }}
          >
            Try again
          </button>
        ) : (
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="bg-blue-900 p-2 text-white rounded text-sm"
          >
            Go Back home
          </button>
        )}
      </div>
    </div>
  );
}
