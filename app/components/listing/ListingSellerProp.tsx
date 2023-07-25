'use client'

import { useContractWrite, useContractRead, useContract, Web3Button } from '@thirdweb-dev/react';
import { Role, SafeListing } from "@/app/types";
import W3Button from "../W3Button";
import {ethers} from 'ethers';
import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import Loader from '../Loader';
import { toast } from "react-hot-toast";

interface sellerProps {

  id: string;
  tokenId: number | null;
  price: number;
  ipfsUri: string | null;

}


const ESCROW_ADDRESS = "0x20D026Ed02d945d8456b8Fa5393F1FcCb78e8218";
const REAL_ESTATE_ADDRESS = "0xAd44cA225473B69022FEd05dE921b810B81a5ab0";


const ListingSellerProp: React.FC<sellerProps> = ({id, tokenId, price, ipfsUri}) => {

    const [hasLoaded, setHasLoaded] = useState(false);


    const { contract: escrow } = useContract(ESCROW_ADDRESS);
    const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);
    const [tokenIdd, setTokenIdd] = useState(0);


    
    const { data: tokenURI, isLoading: tokenURILoading } = useContractRead(realEstate, "tokenURI", [tokenIdd]);
    const { data: propertyData, isLoading: propertyLoading } = useContractRead(escrow, "properties", [tokenIdd]);

    let purchasePrice = propertyData ? parseInt(propertyData.price.toString()) : 0;

    const { mutateAsync: approve, isLoading: approveLoading } = useContractWrite(realEstate, "approve");
    const { mutateAsync: list, isLoading: listingIsLoading } = useContractWrite(escrow, "list");
    const { mutateAsync: updatePrice , isLoading: priceUpdateIsLoading} = useContractWrite(escrow, "updatePrice");
    const { mutateAsync: mint, isLoading: mintLoading } = useContractWrite(realEstate, "mint");

    const setListingTokenId = useCallback(async (_tokenId: string) => {
      const tokenId = parseInt(_tokenId);
      try {
        await axios.patch(`/api/listings/${id}`, { tokenId });
        console.log('listing updated');
        toast.success('Listing updated');
      } catch (error) {
        console.log('Error:', error);
        toast.error('Error updating listing');
      }
      setTokenIdd(tokenId);
    }, [id, setTokenIdd]);

    const mintProperty = useCallback(async () => {
      
      try {
          const data = await mint({ args: [ipfsUri] });
          const bigNumberTokenId = data.receipt?.logs[1].data;
          setListingTokenId(bigNumberTokenId);
        } catch (err) {
          console.error("contract call failure", err);
          toast.error( "An error occurred while minting the property");
        }
      }, [mint, ipfsUri, setListingTokenId]);
 
      const listProperty = async () => {
        try {
          // First, approve the escrow contract to manage the token on behalf of the owner
          await approve({ args: [ESCROW_ADDRESS, tokenIdd] });
          const data = await list({ args: [tokenIdd, ethers.utils.parseEther('2000')] });
          console.info("contract call successs", data);
          toast.success("Property listed successfully")
          return data;
        } catch (err) {
          console.error("contract call failure", err);
          toast.error("An error occurred while listing the property");
        }
      };

  const updatePropertyPrice = useCallback(async () => {
    
    try {
      const data = await updatePrice({ args: [price] });
      console.info("contract call successs", data);
      toast.success("Property price updated successfully")

    } catch (err) {
      console.error("contract call failure", err);
      toast.error("An error occurred while updating the property price")
    }
  }, [updatePrice, price]);
  


    // Then, in your useEffect
    useEffect(() => {
      if (!tokenURILoading) {
        setHasLoaded(true);
      }
      if(tokenId!==null) {
        setTokenIdd(tokenId)
      }
    }, [tokenURILoading, tokenId]);


let button;
if (!hasLoaded || tokenURILoading) {
  button = <Loader />;
} else if (tokenURI) {
  if (purchasePrice) {
    button = (
      <W3Button 
        outline
        label={"Update Price"}
        contractAddress={ESCROW_ADDRESS}
        action={async () => await updatePropertyPrice()}
        isDisabled={propertyLoading}
        onSuccess={(result) => console.log("Transaction successful", result)}
        onError={(error) => console.error("Transaction error", error)}
        onSubmit={() => console.log("Transaction pending...")}
      />
    );
  } else {
    button = (
      <W3Button 
        outline
        label={"List Property"}
        contractAddress={ESCROW_ADDRESS}
        action={async () => await listProperty()}
        isDisabled={listingIsLoading}
        onSuccess={(result) => console.log("Transaction successful", result)}
        onError={(error) => console.error("Transaction error", error)}
        onSubmit={() => console.log("Transaction pending...")}
      />
    );
  }
} else {
  button = (
    <W3Button 
      outline
      label={"Mint"}
      contractAddress={REAL_ESTATE_ADDRESS}
      action={async () => await mintProperty()}
      isDisabled={mintLoading}
      onSuccess={(result) => console.log("Transaction successful", result)}
      onError={(error) => console.error("Transaction error", error)}
      onSubmit={() => console.log("Transaction pending...")}
    />
  );
}
  
  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      < div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">
        {price > 0 ? (
            `Asking Price: ${price}`
        ): (
            `Not Listed ${purchasePrice}`
            )}
        </div>
      </div>
      <hr/>
          <div className="p-4">
            {button}
    </div>
    </div>
  );
}

export default React.memo(ListingSellerProp);