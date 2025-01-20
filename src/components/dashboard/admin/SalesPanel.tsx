import React from "react";
import CardSales from "./CardSales";
import SalesList from "./SalesList";
interface shippingData {
  customerName: string;
  customerPhone: string;
  amountEarned: string;
}
export interface recentShipping {
  shippingData: shippingData[];
}

const SalesPanel = ({ shippingData }: recentShipping) => {
  return (
    <div className=" lg:mt-0 lg:w-[40%] w-full">
      <CardSales
        title="Recent shippings"
        subtitle={`Showing ${shippingData?.length} most recent shipping${
          shippingData?.length > 1 ? "s" : ""
        } this month.`}
      >
        <SalesList shippingData={shippingData} />
      </CardSales>
    </div>
  );
};

export default SalesPanel;
