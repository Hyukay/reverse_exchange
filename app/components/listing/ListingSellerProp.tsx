'use client'

import { useContractWrite, useContractRead, useContract, Web3Button , useStorageUpload} from '@thirdweb-dev/react';
import Button from "../Button";
import { Role, SafeListing } from "@/app/types";
import {Listing } from "@prisma/client";
import W3Button from "../W3Button";
import {ethers} from 'ethers';
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import React, { useState, useCallback, useEffect } from "react";
import prisma from "@/app/libs/prismadb";
import getListingById from '@/app/actions/getListingById';
import { log } from 'console';
import {useRouter} from 'next/navigation'
import axios from 'axios';
import { set } from 'date-fns';
import Loader from '../Loader';
import { BigNumber } from 'ethers';


interface sellerProps {
  address: string | undefined;
  metadata: string;
  listing: SafeListing;
}

const ESCROW_ADDRESS = "0x866F3598Cad6075b8e79De496074B47b3578C6Fd";
const REAL_ESTATE_ADDRESS = "0xAd44cA225473B69022FEd05dE921b810B81a5ab0";


const ListingSellerProp: React.FC<sellerProps> = ({ address, metadata,listing}) => {

  const [hasLoaded, setHasLoaded] = useState(false);


    const { contract: escrow } = useContract(ESCROW_ADDRESS);
    const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);
    
    const [price, setPrice] = useState(0);
    const [tokenId, setTokenId] = useState(0);

    if(listing.tokenId!==null) {
      setTokenId(listing.tokenId)
    }

    const { data: purchasePriceBigNumber, isLoading: priceLoading } = useContractRead(escrow, "price", [listing.ipfsUri]);
    
    console.log('ipfsUri', listing.ipfsUri)
    console.log('tokenId', listing.tokenId)

    const { data: tokenURI, isLoading: tokenURILoading } = useContractRead(realEstate, "tokenURI", [listing.tokenId]);

    let purchasePrice = purchasePriceBigNumber ? parseInt(purchasePriceBigNumber.toString()) : 0;

    const { mutateAsync: list, isLoading: listingIsLoading } = useContractWrite(escrow, "list");
    const { mutateAsync: updatePrice , isLoading: priceUpdateIsLoading} = useContractWrite(escrow, "updatePrice");
    const { mutateAsync: mint, isLoading: mintLoading } = useContractWrite(realEstate, "mint");

    const setListingTokenId = async (bigNumberTokenId: BigNumber) => {
      const tokenId = parseInt(bigNumberTokenId.toString());
      try {
        await axios.patch(`/api/listings/${listing.id}`, { tokenId });
        console.log('listing updated');
      } catch (error) {
        console.log('Error:', error);
      }
      setTokenId(tokenId);
    };

    const mintProperty = useCallback(async () => {

      if(listing.ipfsUri)  {

        try {

          console.log('listing.ipfsUri should be a string here',listing.ipfsUri)
          const data = await mint({ args: [listing.ipfsUri] });
          console.info("contract call successs", data);
          // Fetch the "Transfer" events emitted by the contract
          console.log('Fetching for events emitted by the contract...')
          const bigNumberTokenId = await data.receipt?.logs[1].data
          console.log('bigNumberTokenId', bigNumberTokenId)
          // Get the tokenId from the event
          // Update the listing with the tokenId
          // convert the bigNumber to a string and then to an integer
          const tokenId = parseInt(bigNumberTokenId.toString())
          console.log('tokenId', tokenId)
          setTokenId(tokenId)
          axios.patch(`/api/listings/${listing.id}`, { 
            tokenId: tokenId
           })
           .then(() => {
            console.log('listing updated')
           })
            .catch((error) => { 
              console.log('Error:', error) 
            })
        } catch (err) {
          console.error("contract call failure", err);
        }
      }
    },[listing.ipfsUri, mint, listing.id]);
    
    
  const listProperty = async () => {
    
    try {
      const data = await list({ args: [REAL_ESTATE_ADDRESS, ethers.utils.parseEther('2000'),ethers.utils.parseEther('30')] });
      console.info("contract call successs", data);
      return data;

    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  const updatePropertyPrice = useCallback(async () => {
    try {
      const data = await updatePrice({ args: [price] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }, [updatePrice, price]);

  console.log('tokenURI',tokenURI);


    // Then, in your useEffect
    useEffect(() => {
      if (!tokenURILoading) {
        setHasLoaded(true);
      }
    }, [tokenURILoading]);
  
  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      < div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">
        {price > 0 ? (
            `Asking Price: ${price}`
        ): (
            `Not Listed ${purchasePriceBigNumber}`
            )}
        </div>
      </div>
      <hr/>
          <div className="p-4">
      {/* If the property exists on the blockchain, show the option to List or Update Price of the property */}
      {(!hasLoaded || tokenURILoading) ? (
        <Loader />
        ) : tokenURI ? (
          purchasePriceBigNumber ? (
          <W3Button 
            outline
            label={"Update Price"}
            contractAddress={ESCROW_ADDRESS}
            action={async () => await updatePropertyPrice()}
            isDisabled={priceLoading}
            onSuccess={(result) => console.log("Transaction successful", result)}
            onError={(error) => console.error("Transaction error", error)}
            onSubmit={() => console.log("Transaction pending...")}
          />
        ) : (
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
        )
      ) : (
        /* If the property does not exist on the blockchain, show the option to Mint the property */
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
      )}
    </div>
    </div>
  );
}

export default React.memo(ListingSellerProp);