export interface instruction {
  id?: number;
  portOfdischarge?: string;
  deliveryTerm?: string;
  prepaidFreight?: number;
  prepaidBlFee?: number;
  totalamountinword?: string;
  updatedAt?: string;
  createdAt?: string;
  prepared?: boolean;
  finaldeliverId?: number,
  itemId?:number,
  stuffingReportItems?:any;
  finaldelivery?:any
}
