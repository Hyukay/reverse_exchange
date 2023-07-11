'use client'

import React, { useState, useCallback , useEffect} from "react";
import { useContractWrite, useContractRead, useContract, Web3Button } from '@thirdweb-dev/react';
import Button from "../Button";
import { Role, EscrowData } from "@/app/types";
import W3Button from "../W3Button";

interface sellerProps {
  address: string | undefined;
  id: number;
}

const ESCROW_ADDRESS = "0x866F3598Cad6075b8e79De496074B47b3578C6Fd";
const REAL_ESTATE_ADDRESS = "0xAd44cA225473B69022FEd05dE921b810B81a5ab0";

const ListingSellerProp: React.FC<sellerProps> = ({ address, id }) => {

    const { contract } = useContract(ESCROW_ADDRESS);

    const [price, setPrice] = useState(0);
    const [buttonLabel, setButtonLabel] = useState('null');



    const { data: purchasePriceBigNumber, isLoading: priceLoading } = useContractRead(contract, "price", [id]);
    let purchasePrice = purchasePriceBigNumber ? parseInt(purchasePriceBigNumber.toString()) : 0;
  
    

  const { mutateAsync: list, isLoading: listingIsLoading } = useContractWrite(contract, "list");
  const { mutateAsync: updatePrice } = useContractWrite(contract, "updatePrice");
  
  const listProperty = async () => {
    try {
      const data = await list({ args: [REAL_ESTATE_ADDRESS, 2000,30] });
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
  
/*useEffect(() => {

    if (purchasePrice===null || purchasePrice === undefined || purchasePrice === 0) {

        setPrice(0);
        setButtonLabel("List Property");
    }
    else {
        setPrice(purchasePrice);
        setButtonLabel("Update Price");
    }
    }, [purchasePrice, listProperty, updatePropertyPrice]);
*/
    
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
        <W3Button 
            outline
            label={"List Property"}
            contractAddress={ESCROW_ADDRESS}
            action={async () => await listProperty()}
            isDisabled={listingIsLoading}
            onSuccess={(result) => console.log("Transaction successful", result)}
            onError={(error) => console.error("Transaction error", error)}
            onSubmit={() => console.log("Transaction pending...")}
            
        >
        </W3Button>
      </div>
    </div>
  );
}

export default ListingSellerProp;