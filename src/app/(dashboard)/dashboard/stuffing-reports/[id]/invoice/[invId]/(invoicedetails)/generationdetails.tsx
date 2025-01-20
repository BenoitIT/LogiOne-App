import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const InvoiceGenerationDetails = ({
  ExportInvoicePDf,
  vat,
  setVat,
  totalInwords,
  setTotalInwords,
}: {
  ExportInvoicePDf: () => void;
  vat: string;
  setVat: (val: string) => void;
  totalInwords: string;
  setTotalInwords: (val: string) => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Genarate</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[24rem] mr-4 shadow-lg border border-gray-300 border-t-0">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none uppercase">
              Invoice Details
            </h4>
            <p className="text-sm text-gray-800">
              Record VAT and tatal amount in word
            </p>
          </div>
          <div className="grid gap-2 text-sm text-gray-600">
            <Label>
              VAT (%){" "}
              <span className="lowercase">
                on FREIGHT CHARGES (DUBAI TO KIGALI, RWANDA)
              </span>
            </Label>
            <Input
              type="number"
              value={vat}
              onChange={(e) => setVat(e.target.value)}
              placeholder="Ex: 2.5"
              className="w-full border border-gray-400 placeholder:text-gray-300"
            />
          </div>
          <div className="grid gap-2 text-sm text-gray-600">
            <Label>Total amount in word</Label>
            <Input
              type="text"
              value={totalInwords}
              onChange={(e) => setTotalInwords(e.target.value)}
              placeholder="Ex: Twenty thousands dollars"
              className="w-full border border-gray-400 placeholder:text-gray-300"
            />
          </div>
          <div className="w-full flex justify-between">
            <span className="text-sm text-blue-400">
              Click on invoice for preview
            </span>
            <Button onClick={ExportInvoicePDf}>Export invoice in PDF</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
