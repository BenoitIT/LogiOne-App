export interface invoice{
    id: number,
    date:string;
    consigneeName: string,
    containerId: string,
    origin: string,
    createdBy?:string;
    createdById?:string;
    destination:string,
    invoiceNo: string,
    totalUsd: string,
    totalEud: string,
}