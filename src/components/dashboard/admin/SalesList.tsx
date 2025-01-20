import React from "react";
import SalesItem from "./SalesItem";
import { recentShipping } from "./SalesPanel";

const SalesList = ({ shippingData }: recentShipping) => {
  return (
    <div className="w-full overflow-auto">
      {shippingData?.map((sale, index) => (
        <SalesItem
          key={index}
          name={sale.customerName}
          email={sale.customerPhone}
          amount={sale.amountEarned}
        />
      ))}
    </div>
  );
};

export default SalesList;
