"use client";
import TabularSection from "@/appComponents/pageBlocks/tabularSection";
import { SearchBox } from "@/components/ui/searchBox";
const AgentsInvolved = () => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between mb-2">
      <p className="text-sm uppercase mt-2 font-semibold text-gray-700">
        Sales agents involved
      </p>
      <SearchBox />
    </div>
  );
};
export default TabularSection(AgentsInvolved);
