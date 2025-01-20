"use client";
import { TiArrowBack } from "react-icons/ti";
import { useRouter } from "next/navigation";
const Back = () => {
  const router = useRouter();
  return (
    <button
      className="text-[#003472] text-xl lg:text-2xl bg-white shadow rounded p-2 w-fit"
      onClick={() => router.back()}
    >
      <TiArrowBack />
    </button>
  );
};
export default Back;
