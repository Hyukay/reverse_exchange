'use client'
import React, { useState, useEffect, useCallback } from "react";
import { Contract, ethers } from 'ethers';
import Button from "../Button";
import { Role, EscrowData } from "@/app/types";
import { use } from "chai";
import { useAddress, useConnectionStatus, useContract, useContractRead, useContractWrite} from '@thirdweb-dev/react';

interface ListingBuyProps {
  
  home : any;
  address: any;
  escrow : any;
  price: number;
  role: Role | null | undefined;
  id: string;
  
}



const ListingBuy: React.FC<ListingBuyProps> = ({ home, address, escrow, price, role, id }) => {
  

  const connectionStatus = useConnectionStatus();
  console.log('Current connected address', address)
  console.log('isConnected?', connectionStatus)
  
  const [isApproved, setIsApproved] = useState(false);
  const [inspectionStatus, setInspectionStatus] = useState(false);


  const { contract } = useContract("0x866F3598Cad6075b8e79De496074B47b3578C6Fd");
  const { mutateAsync: list, isLoading: listLoading } = useContractWrite(contract, "list")
  const { mutateAsync: makeOffer, isLoading: makeOfferLoading } = useContractWrite(contract, "makeOffer")
  const { mutateAsync: approveSale, isLoading: approveLoading } = useContractWrite(contract, "approveSale")
  const { mutateAsync: updateInspectionStatus, isLoading: inspectLoading } = useContractWrite(contract, "updateInspectionStatus")
  const { mutateAsync: lend, isLoading: lendLoading} = useContractWrite(contract, "lend")
  

  const sellerHandler = useCallback(async () => {
    try {
      const data = await list({ args: [1, 20, 30] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
   },[list]);

   const buyerHandler = useCallback(async () => {
    try {
      const data = await makeOffer({ args: [id] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }, [makeOffer, id]);

  const inspectorHandler = useCallback(async () => {
    
    try {
      const data = await updateInspectionStatus({ args: [id, inspectionStatus ] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }, [updateInspectionStatus, id, inspectionStatus]);

  const notaryHandler = useCallback(async () => {

    try {
      const data = await approveSale({ args: [1] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }, [approveSale, 1]);
 
    
  
  const [buttonLabel, setButtonLabel] = useState("Make Offer");
  const [buttonAction, setButtonAction] = useState(() => () => {});
  
  useEffect(() => {
   if(role) 
    switch (role) {
      case 'inspector':
        setButtonLabel('Approve');
     //   setButtonAction( );
        break;
      case 'notary':
        setButtonLabel('Inspect');
     //   setButtonAction(undefined);
        break;
      case 'lender':
        setButtonLabel('Lend');
      //  setButtonAction(undefined);
        break;
      case 'seller':
        setButtonLabel('List');
        setButtonAction(sellerHandler);
        break;
      default:
        setButtonLabel('Buy');
        setButtonAction(() => {
       });
        break;
    }
  }, [role, sellerHandler]);

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hBigInt(id)den">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">
         Asking Price: {}
        </div>
      </div>
      <hr/>
      <div className="p-4">
        <label>
          Minimum deposit: {}
        </label>
      </div>
      <hr/>
      <div className="p-4"> 
        <Button 
          label={buttonLabel} 
          onClick={buttonAction}
          />
      </div>
    </div>
  );
}

export default ListingBuy;