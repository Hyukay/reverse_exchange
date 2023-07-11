'use client';

import { Web3Button } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { IconType } from "react-icons";


interface Web3ButtonProps extends React.ComponentProps<typeof Web3Button>{

    label: string;
    outline?: boolean;
    small?: boolean;
    icon?: IconType;

}

const W3Button: React.FC<Web3ButtonProps> = ({ 
    
 
  label,
  outline,
  small,
  icon: Icon,
  ...props
}) => {
  return ( 
    <Web3Button
        {...props}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-full
        ${outline ? 'bg-white' : 'bg-custom-light'}
        ${outline ? 'border-black' : 'border-custom-light'}
        ${outline ? 'text-black' : 'text-white'}
        ${small ? 'text-sm' : 'text-md'}
        ${small ? 'py-1' : 'py-3'}
        ${small ? 'font-light' : 'font-semibold'}
        ${small ? 'border-[1px]' : 'border-2'}
      `}
    >
      {Icon && (
        <Icon
          size={24}
          className="
            absolute
            left-4
            top-3
          "
        />
      )}
        {label} 
    </Web3Button>
   );
}
 
export default W3Button;