'use client';


/**
 * @author Khalil Anis Zabat
 */


import Image from "next/image";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { useState, useEffect } from 'react';

import Heading from "../Heading";
import HeartButton from "../HeartButton";
import { MediaRenderer } from "@thirdweb-dev/react";
import { ThirdwebStorage } from "@thirdweb-dev/storage";


interface ListingHeadProps {

  title: string;
  locationValue: string;
  image: string | null;
  id: string;
  currentUser?: SafeUser | null

}



const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  image,
  id,
  currentUser
}) => {
  const { getByValue } = useCountries();
  
  const location = getByValue(locationValue);
 
  return ( 
    <>
      <Heading
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
      />
      <div className="
          w-full
          h-[60vh]
          overflow-hidden 
          rounded-xl
          relative
        "
      >
       <MediaRenderer
          src={image || 'images/Logo_PlaceHolder.png'}
          style={{objectFit: 'cover', width: 'auto', height: 'auto'}}
          className="object-cover w-full h-full"
          alt="Image"
        />
        <div
          className="
            absolute
            top-5
            right-5
          "
        >
          <HeartButton 
            listingId={id}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
   );
}
 
export default ListingHead;