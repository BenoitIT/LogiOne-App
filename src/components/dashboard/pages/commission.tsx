"use client";
import TabularSection from "@/appComponents/pageBlocks/tabularSection";
import Back from "@/components/ui/back";
import { SearchBox } from "@/components/ui/searchBox";
const CommissionSection = () => {
  return (
    <div className="w-full flex justify-between mb-4 flex-col md:flex-row gap-2">
      <div className="flex flex-row gap-2 h-fit">
        <Back />
        <SearchBox />
      </div>
    </div>
  );
};
export default TabularSection(CommissionSection);
