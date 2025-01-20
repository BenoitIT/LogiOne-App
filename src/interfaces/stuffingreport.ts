export interface StuffingReport {
    id?:number;
    origin?: string;
    finaldeliverId?: number;
    destination?: any;
    packagingType?:string;
    status?: string;
    code?:string;
    blCode?:string;
    shipperId?:number|null,
    operatorId?:number,
    extraCharges?:number,
    createdAt?:any;
  }