import React from "react";
import Avatar from "./AvatarCard";

interface SalesItemProps {
  name: string;
  email: string;
  amount: string;
}

const SalesItem: React.FC<SalesItemProps> = ({
  name,
  email,
  amount,
}) => {
  return (
    <div className="flex justify-between items-center py-2">
      <Avatar name={name} email={email}/>
      <p className="font-medium text-[#003472] text-sm">+${amount}</p>
    </div>
  );
};

export default SalesItem;
