"use client";
import TabularSection from "@/appComponents/pageBlocks/tabularSection";
import ExportButton from "@/components/ui/exportBtn";
import { SearchBox } from "@/components/ui/searchBox";
import Back from "@/components/ui/back";
const Invoices = () => {
  return (
    <div>
      <div className="w-full flex flex-col-reverse md:flex-row justify-between mb-4 gap-2">
        <div>
          <Back />
        </div>
        <div className="flex gap-2 justify-end w-full flex-col-reverse md:flex-row">
          <div className="-mt-1 w-full">
            <SearchBox />
          </div>
          <ExportButton />
        </div>
      </div>
    </div>
  );
};
export default TabularSection(Invoices);
