import { mutate } from "swr";
import { addStuffingReportsItems } from "@/app/httpservices/stuffingReport";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NewStuffingItem } from "@/interfaces/stuffingItem";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";

interface StepFormProps {
  newItemPayload: NewStuffingItem;
  setItemsData: (
    value:
      | Partial<NewStuffingItem>
      | ((prevState: NewStuffingItem) => Partial<NewStuffingItem>)
  ) => void;
  setActiveForm: (val: number) => void;
  currentTotals: any;
}
const StepThree = ({
  setActiveForm,
  newItemPayload,
  setItemsData,
}: StepFormProps) => {
  const params = useParams();
  const router = useRouter();
  const staffReportId = params?.contid;
  const cacheKey = `/stuffingreports/${Number(staffReportId)}`;
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      delete newItemPayload.id;
      const { message, status } = await addStuffingReportsItems(
        Number(staffReportId),
        newItemPayload
      );
      if (status == 201) {
        toast.success(message);
        mutate(cacheKey);
        router.back();
      } else {
        toast.error(message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to record shipment.");
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.type == "number") {
      setItemsData((prev: NewStuffingItem) => ({
        ...prev,
        [e.target.name]: Number(e.target.value),
      }));
    } else {
      setItemsData((prev: NewStuffingItem) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };
  const handletxtChange=(e:ChangeEvent<HTMLInputElement>)=>{
    setItemsData((prev: NewStuffingItem) => ({
      ...prev,
      totalinwords: e.target.value,
    }));
  }
  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <p className="text-center pb-1 mb-6 font-semibold text-gray-700 border-b border-gray-400">
        Data review
      </p>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="consignee">
              Customer <span className="text-red-500">*</span>
            </Label>
            <span className="w-full flex-shrink text-sm text-gray-600 capitalize">
              {newItemPayload?.customername}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.type}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.code}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mark">Mark</Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.mark}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="salesAgent">
              Sales agent <span className="text-red-500">*</span>
            </Label>
            <span className="w-full flex-shrink text-sm text-gray-600 capitalize">
              {newItemPayload?.agentname}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="noOfPkgs">
              No of packages<span className="text-red-500">*</span>
            </Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.noOfPkgs}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="typeOfPackage">
              Type of package<span className="text-red-500">*</span>
            </Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.typeOfPkg}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight">
              Weight<span className="text-red-500">*</span>
            </Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.weight}
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">
            Description<span className="text-red-500">*</span>
          </Label>
          <span className="w-full flex-shrink text-sm text-gray-600">
            {newItemPayload?.description}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Handling</Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.handling ?? ""}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="code">CBM</Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.cbm ?? ""}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="line">
              Lines<span className="text-red-500">*</span>
            </Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.line}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="freight">
              Freight<span className="text-red-500">*</span>
            </Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.freight}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="blFee">
              BL Fee<span className="text-red-500">*</span>
            </Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.blFee}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="noOfPkgs">
              JB<span className="text-red-500">*</span>
            </Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.jb}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mark">Car hanging</Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.carHanging ?? "-"}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mark">Inspection</Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.inspection ?? "-"}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mark">Recovery</Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.recovery ?? "-"}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mark">Insurance</Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.insurance ?? "-"}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mark">Local Charges</Label>
            <span className="w-full flex-shrink text-sm text-gray-600">
              {newItemPayload?.localCharges ?? "-"}
            </span>
          </div>
        </div>
        <div className="w-full flex justify-between p-2 bg-blue-900 text-white rounded text-sm">
          <span className="uppercase ">
            TOTAL Amount in usd
            ........................................................................................
          </span>
          <span>
            {Intl.NumberFormat("en-US").format(
              Number(newItemPayload?.freight ?? 0) +
                Number(newItemPayload?.blFee ?? 0) +
                Number(newItemPayload?.jb ?? 0) +
                Number(newItemPayload?.inspection ?? 0) +
                Number(newItemPayload?.localCharges ?? 0) +
                Number(newItemPayload?.insurance ?? 0) +
                Number(newItemPayload?.carHanging ?? 0) +
                Number(newItemPayload?.recovery ?? 0)
            )}
          </span>
        </div>
        <div className="grid grid-col-1 md:grid-cols-2 w-full gap-3 text-sm my-2">
          <div className="grid gap-2 text-sm text-gray-600 uppercase">
            <Label>Total amount in word</Label>
            <Input
              type="text"
              value={newItemPayload?.totalinwords}
              onChange={handletxtChange}
              placeholder="Ex: Twenty thousands dollars"
              className="w-full border border-gray-400 placeholder:text-gray-300"
            />
          </div>
          <div className="grid gap-2 text-sm text-gray-600 uppercase">
            <Label>PORT OF DISCHARGE</Label>
            <Input
              type="text"
              placeholder="Ex: Mombasa"
              className="w-full border border-gray-400 placeholder:text-gray-300"
              name="portOfdischarge"
              onChange={handleChange}
              value={newItemPayload?.portOfdischarge}
            />
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <Button
            type="button"
            className="w-fit"
            variant="secondary"
            onClick={() => setActiveForm(2)}
          >
            Back
          </Button>
          <Button type="submit" className="w-fit">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};
export default StepThree;
