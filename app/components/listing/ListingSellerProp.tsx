'use client'

import { useContractWrite, useContractRead, useContract, Web3Button, useAddress, useContractEvents } from '@thirdweb-dev/react';
import { Role, SafeListing } from "@/app/types";
import W3Button from "../W3Button";
import {ethers} from 'ethers';
import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import Loader from '../Loader';
import { toast } from "react-hot-toast";
import Heading from '../Heading';
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS } from "@/app/libs/constant";
import formatNumber from '@/app/libs/formatNumber';

interface sellerProps {

  id: string;
  tokenId: number | null;
  price: number;
  ipfsUri: string | null;

}






const ListingSellerProp: React.FC<sellerProps> = ({id, tokenId, price, ipfsUri}) => {



    const  account  = useAddress();

    const [hasLoaded, setHasLoaded] = useState(false);


    const { contract: escrow } = useContract(ESCROW_ADDRESS);
    const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);
    const [tokenIdd, setTokenIdd] = useState<number | null>(null);


    
    const { data: tokenURI, isLoading: tokenURILoading } = useContractRead(realEstate, "tokenURI", [tokenIdd]);
    const { data: propertyData, isLoading: propertyLoading } = useContractRead(escrow, "properties", [tokenIdd]);

    let purchasePrice = propertyData ? parseInt(propertyData.price.toString()) : 0;

    const { mutateAsync: approve, isLoading: approveLoading } = useContractWrite(realEstate, "approve");
    const { mutateAsync: list, isLoading: listingIsLoading } = useContractWrite(escrow, "list");
    const { mutateAsync: updatePrice , isLoading: priceUpdateIsLoading} = useContractWrite(escrow, "updatePrice");
    const { mutateAsync: mintTo, isLoading: mintLoading } = useContractWrite(realEstate, "mintTo");
   
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

          const data = await mintTo({ args: [account,ipfsUri] });
          const bigNumberTokenId = data.receipt?.logs[0].topics[3];
          setListingTokenId(bigNumberTokenId);
          console.info('contract call successs', data);
          toast.success('Property minted successfully');

      } catch (err) {
          console.error("contract call failure", err);
          toast.error( "An error occurred while minting the property");
      }
      
      }, [mintTo, ipfsUri, setListingTokenId, account]);
 
      const listProperty = async () => {
        const params = {
          assetContract: REAL_ESTATE_ADDRESS, 
          tokenId: tokenIdd, 
          quantity: 1, 
          currency: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 
          pricePerToken: 0.001, 
          startTimestamp: Math.floor(Date.now() / 1000), 
          endTimestamp: Math.floor(Date.now() / 1000) + 3600,  // For example, 1 hour from now
          reserved: false 
            }
        try {
          // First, approve the escrow contract to manage the token on behalf of the owner
          //await approve({ args: [ESCROW_ADDRESS, tokenIdd] });
          const data = await list({ args: [params]});
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
  button = <div>Loading...<Loader /></div>;
} else if (tokenURI) {
  if (purchasePrice>0) {
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
            <Heading title= {`Your price $ ${formatNumber(price)}`}/>
        ): (
            <Heading title ={`Not Listed ${formatNumber(purchasePrice)}`}/>
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