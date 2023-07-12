'use client';

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
  imageSrc: string | null;
  id: string;
  currentUser?: SafeUser | null

}

const storage = new ThirdwebStorage();

const handleUriToUrl = async (uri: string) => {
  const url = await storage.resolveScheme(uri);
  return url;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  imageSrc,
  id,
  currentUser
}) => {
  const { getByValue } = useCountries();

  const location = getByValue(locationValue);
  
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageSrc) {
      handleUriToUrl(imageSrc).then(setImageUrl);
    }
  }, [imageSrc]);
 
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
          src={imageSrc}
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