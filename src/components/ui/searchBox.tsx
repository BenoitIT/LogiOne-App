import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
export const SearchBox = () => {
  const searchParams: any = useSearchParams();
  const searchValue = searchParams?.get("search");
  const [search, setSearch] = useState(searchValue);
  const router = useRouter();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    router.push(`?${createQueryString("search", value)}`);
  };
  return (
    <div className="flex items-center w-full md:w-[480px] max-w-fit h-fit space-x-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 m-1">
      <SearchIcon className="h-5 w-5 text-gray-500 hover:cursor-pointer hover:text-blue-900" />
      <Input
        type="search"
        placeholder="Search..."
        value={search ?? ""}
        className="w-full border-0 h-6 font-normal placeholder:font-normal text-black"
        onChange={handleChange}
      />
    </div>
  );
};
