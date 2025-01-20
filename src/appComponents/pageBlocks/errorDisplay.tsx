import React from "react";
import { BiSolidErrorAlt } from "react-icons/bi";
interface error {
  message?: string;
}
const ErrorSection = ({ message }: error) => {
  return (
    <div className="flex items-center gap-3 min-h-[85vh] justify-center">
      <div className="bg-white px-6 py-4 rounded shadow-sm flex flex-col gap-2 justify-center items-center">
        <BiSolidErrorAlt className="text-red-600 text-6xl" />
        <span className="text-red-600 text-sm md:text-base flex flex-shrink">
          {message ? message : "Failed to load records"}
        </span>
      </div>
    </div>
  );
};

export default ErrorSection;
