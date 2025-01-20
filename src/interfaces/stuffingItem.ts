export interface NewStuffingItem {
  id?: number;
  shipper?: number;
  consignee?: number;
  customername?: string;
  destination?: number;
  code?: string;
  mark?: string;
  salesAgent?: number;
  agentname?: string;
  salesAgentId?: number;
  noOfPkgs?: number;
  typeOfPkg?: string;
  weight?: number;
  line?: number;
  handling?: number;
  type?: string;
  cbm?: number;
  description?: string;
  freight?: number;
  blFee?: number;
  jb?: number;
  inspection?: number;
  carHanging?: number;
  recovery?: number;
  insurance?: number;
  localCharges?: number;
  invoiceNo?: string;
  shipperId?: number;
  consigneeId?: number;
  totalUsd?:number;
  preparedBy?:string;
  editedBy?:string;
  instructionPrepared?: boolean;
  invoiceInfo?:any[]
  portOfdischarge?:string;
  totalinwords?:string;
  editedAt?:string;
  createdAt?:any;
}
export interface NewStuffingItemErrors {
  shipper?: string | null;
  consignee?: string | null;
  code?: string | null;
  mark?: string | null;
  salesAgent?: string | null;
  noOfPkgs?: number;
  typeOfPkg?: string | null;
  weight?: string | null;
  line?: string | null;
  destination?: string | null;
  handling?: string | null;
  type?: string | null;
  cbm?: string | null;
  description?: string | null;
  freight?: string | null;
  blFee?: string | null;
  jb?: string | null;
}

export interface StepFormProps {
  setItemsData: (
    value:
      | Partial<NewStuffingItem>
      | ((prevState: NewStuffingItem) => Partial<NewStuffingItem>)
  ) => void;
  setValidationErrors: (
    value:
      | Partial<NewStuffingItemErrors>
      | ((prevState: NewStuffingItemErrors) => Partial<NewStuffingItemErrors>)
  ) => void;
  errors: NewStuffingItemErrors;
  ErrorLogger: (key: string, message: string | null) => void;
  newItemPayload: NewStuffingItem;
  setActiveForm: (val: number) => void;
}
export interface StuffingReportTotals {
  noOfPkgs: number;
  weight: number;
  cbm: number;
  line: number;
  handling: number;
  freight: number;
  blFee: number;
  jb: number;
  inspection: number;
  insurance: number;
  localCharges: number;
  recovery: number;
  carHanging:number;
  totalUsd: number;
  totalAed: number;
}
