'use client'

import { useContractWrite, useContractRead, useContract, Web3Button , useStorageUpload} from '@thirdweb-dev/react';
import Button from "../Button";
import { Role, EscrowData } from "@/app/types";
import W3Button from "../W3Button";
import {ethers} from 'ethers';
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import React, { useState, useCallback, useEffect } from "react";



interface sellerProps {
  address: string | undefined;
  metadata: string;
}

const ESCROW_ADDRESS = "0x866F3598Cad6075b8e79De496074B47b3578C6Fd";
const REAL_ESTATE_ADDRESS = "0xAd44cA225473B69022FEd05dE921b810B81a5ab0";

const ListingSellerProp: React.FC<sellerProps> = ({ address, metadata }) => {
    const { mutateAsync: upload } = useStorageUpload();
    const { contract: escrow } = useContract(ESCROW_ADDRESS);
    const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);


    const [price, setPrice] = useState(0);
    const [ipfsUri, setIpfsUri] = useState('null');

    console.log('metadata on first render',metadata)
    

    const { data: purchasePriceBigNumber, isLoading: priceLoading } = useContractRead(escrow, "price", [ipfsUri]);
    const { data: tokenURI, isLoading: tokenLoading } = useContractRead(realEstate, "tokenURI", [ipfsUri]);
    //let purchasePrice = purchasePriceBigNumber ? parseInt(purchasePriceBigNumber.toString()) : 0;
    

    const { mutateAsync: list, isLoading: listingIsLoading } = useContractWrite(escrow, "list");
    const { mutateAsync: updatePrice } = useContractWrite(escrow, "updatePrice");
    const { mutateAsync: mint, isLoading: mintLoading } = useContractWrite(realEstate, "mint");

    const mintProperty = async () => {

      if(typeof ipfsUri === 'string' && ipfsUri)  {
        try {
          console.log('ipfsUri should be a string here',ipfsUri)
          const data = await mint({ args: [ipfsUri] });
          console.info("contract call successs", data);
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
        console.log('ipfsUri',ipfsUri);
        setIpfsUri(ipfsUri);
      } catch (err) {
        console.log('Metadata is not a string:', metadata);
      }
    }
  
    fetchId();
  }, [metadata, upload]);
    
  
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