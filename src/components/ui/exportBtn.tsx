import { useCallback } from "react";
import { Button } from "./button";
import { useRouter, useSearchParams } from "next/navigation";

const ExportButton = () => {
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const handExportClick = () => {
    router.push(`?${createQueryString("export", "true")}`);
  };
  return (
    <Button
      className="hover:bg-[#003472] bg-[#189bcc]"
      onClick={handExportClick}
    >
      Export
    </Button>
  );
};
export default ExportButton;
