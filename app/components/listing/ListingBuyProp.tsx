'use client'
import React, { useState, useEffect, useCallback } from "react";
import { Contract, ethers } from 'ethers';
import Button from "../Button";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import config from '../../../config.json';
import { escrowABI } from "@/app/abis/Escrow";
import { Role, EscrowData } from "@/app/types";
import { use } from "chai";

interface ListingBuyProps {
  home : any;
  account : string | null;
  escrow : Contract | null | undefined;
  price: number;
  role: Role | null | undefined;
  id: string;
}

const ListingBuy: React.FC<ListingBuyProps> = ({ home, account, escrow, price, role, id }) => {
   
  const {address, isConnected} = useAccount();
  console.log('Current connected address', address)
  console.log('isConnected?', isConnected)
  let {data : seller, isError: sellerError, isLoading: sellerLoading, Error: errorS} = useContractRead({

    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: escrowABI,
    functionName: 'getNumber',
    watch: true,
    chainId: 31337,
    enabled: true, 
    }) as any

    console.log('SELLER', seller, sellerError, sellerLoading, errorS)


  //To read the amount to deposit for the escrow
  let {data : escrowAmount } = useContractRead({
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: escrowABI,
    functionName: 'isListed',
    args: [1],
    watch: true,
    }) as any

    console.log('ESCROW AMOUNT', escrowAmount)
    //read the escrowAmount make it assignable to reactNode
    //to read the price of the property

    //read the escrowAmount from the escrow contract using ethers.js 
  let {data: purchasePrice} = useContractRead({
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: escrowABI,
    functionName:'purchasePrice',
    args:[2],
    watch: true,
  }) as {data: EscrowData | undefined}

  let {data: totalSupply} = useContractRead({
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: escrowABI,
    functionName:'getBalance',
  }) as any

  console.log('TOTAL SUPPLY', totalSupply)

  let { config: depositEarnest, isLoading: depositLoading, error: depositError,  } = usePrepareContractWrite({

    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
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
    try{
    if(writeDeposit){
    await writeDeposit()
    }    
    if(writeApprove){
    await writeApprove()
    }
  } catch{
    console.error("Error in depositEarnest:", depositError)
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

 

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price);

 

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
          onClick={buyHandler}
          />
      </div>
    </div>
  );
}

export default ListingBuy;