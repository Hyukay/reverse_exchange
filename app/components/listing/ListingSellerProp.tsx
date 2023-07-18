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



interface sellerProps {
  address: string | undefined;
  metadata: string;
  listing: SafeListing;
}

const ESCROW_ADDRESS = "0x866F3598Cad6075b8e79De496074B47b3578C6Fd";
const REAL_ESTATE_ADDRESS = "0xAd44cA225473B69022FEd05dE921b810B81a5ab0";


const ListingSellerProp: React.FC<sellerProps> = ({ address, metadata,listing}) => {

    const { mutateAsync: upload } = useStorageUpload();
    const { contract: escrow } = useContract(ESCROW_ADDRESS);
    const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);
    
    const [price, setPrice] = useState(0);
    const router = useRouter();

    const { data: purchasePriceBigNumber, isLoading: priceLoading } = useContractRead(escrow, "price", [listing.ipfsUri]);
    console.log('tokenId', listing.tokenId)
    const { data: tokenURI, isLoading: tokenLoading } = useContractRead(realEstate, "tokenURI", [listing.tokenId]);

    let purchasePrice = purchasePriceBigNumber ? parseInt(purchasePriceBigNumber.toString()) : 0;

    const { mutateAsync: list, isLoading: listingIsLoading } = useContractWrite(escrow, "list");
    const { mutateAsync: updatePrice } = useContractWrite(escrow, "updatePrice");
    const { mutateAsync: mint, isLoading: mintLoading } = useContractWrite(realEstate, "mint");

    const mintProperty = async () => {

      if(listing.ipfsUri)  {
        try {

          console.log('listing.ipfsUri should be a string here',listing.ipfsUri)
          const data = await mint({ args: [listing.ipfsUri] });
          console.info("contract call successs", data);
          // Fetch the "Transfer" events emitted by the contract
          console.log('Fetching for events emitted by the contract...')
          const events = await realEstate?.events.getEvents("Transfer")
          console.log('events', events)
          // Get the tokenId from the event
          const event = events?.find(event => event.data.to === address)

          // Update the listing with the tokenId
          const tokenId = event?.data.tokenId.toString(ethers.utils.FormatTypes.hex);
          axios.patch(`/api/listings/${listing.id}`, { 
            tokenId: tokenId
           })
           .then(() => {
            console.log('listing updated')
            router.refresh();
           })
            .catch((error) => { 
              console.log('Error:', error) 
            })
        } catch (err) {
          console.error("contract call failure", err);
        }
      }
    };
    
    
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
  

  useEffect(() => {
    async function fetchId() {
      try {
        const dataToUpload = [metadata];
        const uris = await upload({ data: dataToUpload });
        const ipfsUri = uris[0];  // Assuming only one file is uploaded
        axios.patch(`/api/listings/${listing.id}`, {
          ipfsUri: ipfsUri
        })
        .then(() => {
          console.log('listing updated')
        })
      } catch (err) {
        console.log('Metadata is not a string:', metadata);
      }
    }
    if(listing.ipfsUri === null || listing.ipfsUri === undefined){
    fetchId();
    }
  }, [metadata, upload, tokenURI, listing.ipfsUri, listing]);

  console.log('tokenURI',tokenURI);
  
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
      {(tokenURI !== null && tokenURI !== undefined) ? (
        purchasePriceBigNumber !== null && purchasePriceBigNumber !== undefined ? (
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

export default ListingSellerProp;