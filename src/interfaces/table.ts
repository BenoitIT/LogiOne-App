import { StuffingReportTotals } from "./stuffingItem";

export interface TableProps<T> {
    headers: {
      header: string;
      field: string;
      hidden?:boolean
    }[];
    data: T[];
    action?: {
      icon: React.ReactNode|JSX.Element;
      Click:((id: number) => Promise<any>);
      name?: string;
    }[];
    allowItemsSummationFooter?:boolean;
    summation?:StuffingReportTotals;
    stuffingRprt?:boolean;
    preparedRprt?:boolean;
  }