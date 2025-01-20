"use client";
import TabularSection from "@/appComponents/pageBlocks/tabularSection";
import { Button } from "@/components/ui/button";
import ExportButton from "@/components/ui/exportBtn";
import { SearchBox } from "@/components/ui/searchBox";
import { useRouter, usePathname } from "next/navigation";
const Consignee = () => {
  const router = useRouter();
  const currentPath: string | null = usePathname();
  const handleAddNew = () => {
    router.push(`${currentPath}/newconsignee`);
  };
  return (
    <div>
      <div className="w-full flex flex-col-reverse md:flex-row justify-between mb-4 gap-2">
        <SearchBox />
        <div className="flex gap-2 justify-end w-full">
          <ExportButton />
          <Button onClick={handleAddNew}>Add new</Button>
        </div>
      </div>
    </div>
  );
};
export default TabularSection(Consignee);
