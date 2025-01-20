"use client";
import TabularSection from "@/appComponents/pageBlocks/tabularSection";
const ClientsInvolved = () => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between mb-2">
      <p className="text-sm uppercase mt-2 font-semibold text-gray-700">
        Customers involved
      </p>
    </div>
  );
};
export default TabularSection(ClientsInvolved);
