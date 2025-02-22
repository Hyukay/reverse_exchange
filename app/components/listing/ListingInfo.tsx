'use strict';


/**
 * @author Khalil Anis Zabat
 */


import dynamic from "next/dynamic";
import { IconType } from "react-icons";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import ListingHistory from "./ListingHistory";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";

const Map = dynamic(() => import('../Map'), { 
  ssr: false 
});

interface ListingInfoProps {
  user: SafeUser,
  description: string;
  roomCount: number;
  bathroomCount: number;
  category: {
    icon: IconType,
    label: string;
    description: string;
  } | undefined
  locationValue: string;  
  isAvailable: boolean;
  isInspected: boolean;
  isApproved: boolean;
  realTokenId: string | undefined;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  roomCount,
  bathroomCount,
  category,
  locationValue,
  isApproved,
  isAvailable,
  isInspected,
  realTokenId
}) => {
  const { getByValue } = useCountries();
  
  const coordinates = getByValue(locationValue)?.latlng

  return ( 
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div 
          className="
            text-xl 
            font-semibold 
            flex 
            flex-row 
            items-center
            gap-2
          "
        >
          <div>Sold by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
        <div className="
            flex 
            flex-row 
            items-center 
            gap-4 
            font-light
            text-neutral-500
          "
        >
          <div>
            {roomCount} rooms
          </div>
          <div>
            {bathroomCount} bathrooms
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          {isApproved && <FiCheckCircle className="text-green-500" />}
          {isInspected && <FiCheckCircle className="text-green-500" />}
          {!isAvailable && <><FiXCircle className="text-red-500" /><span> This property is currently unavailable</span></>}
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          icon={category.icon} 
          label={category?.label}
          description={category?.description} 
        />
      )}
      <hr />
      <div className="
      text-lg font-light text-neutral-500">
        {description}
      </div>
      <hr />
      <Map center={coordinates} />
      <ListingHistory 
        realTokenId={realTokenId}
      />
    </div>
   );
}
 
export default ListingInfo;
