"use client";
import TabularSection from "@/appComponents/pageBlocks/tabularSection";
const SingleAgentSales = () => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between mb-2">
      <p className="text-sm uppercase mt-2 font-semibold text-gray-700">
        sales made
      </p>
    </div>
  );
};
export default TabularSection(SingleAgentSales);
