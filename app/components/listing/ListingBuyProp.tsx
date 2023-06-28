'use client';

import { useState, useEffect, useCallback} from "react";
import Button from "../Button";
import getCurrentUser from '../../actions/getCurrentUser';
import { useAccount, useContractRead, useContractWrite } from 'wagmi' 
import config from '../../../config.json';
import { sepolia } from 'wagmi';
import { Address, SafeUser } from "@/app/types";
import { escrowABI } from "@/app/abis/Escrow";
import { useWalletClient, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { write } from "fs";
import { BsFillNutFill } from "react-icons/bs";




interface ListingBuyProps {
  price: number;
  role: string | null | undefined// will have to create a role type
  id : string
 /* buyer: string | null;
  lender: string| null;
  inspector: string | null;
  seller: string  | null;*/
  
}




const ListingBuy: React.FC<ListingBuyProps> = ({
  price,
  role,
  id,
}) => {
  

  const {address} = useAccount();
  
  //To read the amount to deposit for the escrow
  let {data:escrowAmount} = useContractRead({
    address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    abi: escrowABI,
    functionName: 'escrowAmount',
    args: [1],
    watch: true,
    })

    //read the escrowAmount make it assignable to reactNode
    //to read the price of the property

  let {data: purchasePrice} = useContractRead({
    address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    abi: escrowABI,
    functionName:'purchasePrice',
    args:[2],
    watch: true,
  })

  let { config: depositEarnest, isLoading: depositLoading, error: depositError,  } = usePrepareContractWrite({

    address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    abi: escrowABI,
    functionName: 'escrowAmount',
    args: [escrowAmount],
    account: address

  })

  const {writeAsync: writeDeposit} = useContractWrite(depositEarnest)

  let {config: lenderPurchase, error: lenderPurchaseError} = usePrepareContractWrite({

    address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    abi: escrowABI,
    functionName: 'escrowAmount',
    args: [id],
    account: address

  })

  //const {data: depositData, write} = useContractWrite(depositEarnest);

  //Buyer approves sale
  let { config: approveSale, isLoading: approveSaleLoading, error: approveSaleError } = usePrepareContractWrite({

    address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    abi: escrowABI,
    functionName: 'approveSale',
    args: [id],
    account: address

  })

  const {writeAsync: writeApprove} = useContractWrite(approveSale);

  let {config: updateInspectionStatus, isLoading: updateInspectionStatusLoading, error: updateInspectionStatusError} = usePrepareContractWrite({

    address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    abi: escrowABI,
    functionName:'updateInspectionStatus',
    args: [id,true],
    account: address


  })

  const {data: updateInspectionStatusData, writeAsync: writeInspectionStatus} = useContractWrite(updateInspectionStatus);

  const buyHandler = useCallback(async () => {
    if(writeDeposit){
    await writeDeposit()
    }    
    if(writeApprove){
    await writeApprove()
    }
  }, [writeDeposit, writeApprove])

  // TODO
  const inspectHandler = useCallback(async () => {
    if(writeDeposit){
    await writeDeposit()
    }    
    if(writeApprove){
    await writeApprove()
    }
  }, [writeDeposit, writeApprove])
  // TODO 
  const sellerHandler = useCallback(async () => {
    if(writeDeposit){
    await writeDeposit()
    }    
    if(writeApprove){
    await writeApprove()
    }
  }, [writeDeposit, writeApprove])
  // TODO
  const notaryHandler = useCallback(async () => {
    if(writeDeposit){
    await writeDeposit()
    }    
    if(writeApprove){
    await writeApprove()
    }
  }, [writeDeposit, writeApprove])
  // TODO
  const lenderHandler = useCallback(async () => {
    if(writeDeposit){
    await writeDeposit()
    }    
    if(writeApprove){
    await writeApprove()
    }
  }, [writeDeposit, writeApprove])

  
  const formatData = (data: unknown): string => {
    if (typeof data === 'object' || typeof data === 'number') {
      return data.toString();
    }
    return 'Loading...'; 
  }



  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price);

  //called when a buyer wants to bBigInt(id)/ put a buying offer. (signed) (contract not modified yet)

  // Will have to change this for a usecontract write and then write then new price on the contract. 
  
  const [buttonLabel, setButtonLabel] = useState("Make Offer");
  const [buttonAction, setButtonAction] = useState(() => () => {});
  
  useEffect(() => {
   if(role) 
    switch (role) {
      case 'inspector':
        setButtonLabel('Approve');
        setButtonAction(inspectHandler);
        break;
      case 'notary':
        setButtonLabel('Inspect');
        setButtonAction(notaryHandler);
        break;
      case 'lender':
        setButtonLabel('Lend');
        setButtonAction(lenderHandler);
        break;
      case 'seller':
        setButtonLabel('Sell');
        setButtonAction(sellerHandler);
        break;
      default:
        setButtonLabel('Buy');
        setButtonAction(() => {
          buyHandler
       });
        break;
   
    }
  }, [role,buyHandler, inspectHandler, lenderHandler,notaryHandler,sellerHandler ]);


  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hBigInt(id)den">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">
         Asking Price: {formatData(purchasePrice)}
        </div>
      </div>
      <hr/>
      <div className="p-4">
        <label>
          Minimum deposit = {formatData(escrowAmount)}
        </label>
      </div>
      <hr/>
      <div className="p-4"> 
        <Button 
          label={buttonLabel} 
          onClick={buttonAction}/>
      </div>
    </div>
  );
}

export default ListingBuy;