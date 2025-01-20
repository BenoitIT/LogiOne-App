import React from 'react';
import Image from 'next/image';


interface AvatarProps {
  name: string;
  email: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, email }) => {
  return (
    <div className="flex items-center">
      <Image
      src={"/images/avatar.png"}
      width={50}
      height={50}
      alt={`${name}'s avatar`}
      className="w-10 h-10 rounded-full"
       />
      <div className="ml-3">
        <p className="font-medium text-gray-600">{name}</p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
    </div>
  );
};

export default Avatar;
