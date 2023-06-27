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
  
  const clicked = false

  const {address} = useAccount()


  //To read the amount to deposit for the escrow
  let {data:escrowAmount} = useContractRead({
    address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    abi: escrowABI,
    functionName: 'escrowAmount',
    args: [BigInt(id)],
    watch: true,
    })

    //read the escrowAmount make it assignable to reactNode
    
    //to read the price of the property

  let {data: purchasePrice} = useContractRead({
    address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    abi: escrowABI,
    functionName:'purchasePrice',
    args:[BigInt(id)],
    watch: true,
  })

  
  let { config: depositEarnest, isLoading: depositLoading, error: depositError,  } = usePrepareContractWrite({

    address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    abi: escrowABI,
    functionName: 'escrowAmount',
    args: [escrowAmount],
    account: address

  })

  const {writeAsync: writeDeposit} = useContractWrite(depositEarnest)

  let {config: lenderPurchase, error: lenderPurchaseError} = usePrepareContractWrite({
  
    address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    abi: escrowABI,
    functionName: 'escrowAmount',
    args: [BigInt(id)],
    account: address

  })



  //const {data: depositData, write} = useContractWrite(depositEarnest);

  //Buyer approves sale
  let { config: approveSale, isLoading: approveSaleLoading, error: approveSaleError } = usePrepareContractWrite({

    address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    abi: escrowABI,
    functionName: 'approveSale',
    args: [BigInt(id)],
    account: address
    
  })

  const {data: approveSaleData, writeAsync} = useContractWrite(approveSale);

  let {config: updateInspectionStatus, isLoading: updateInspectionStatusLoading, error: updateInspectionStatusError} = usePrepareContractWrite({

    address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    abi: escrowABI,
    functionName:'updateInspectionStatus',
    args: [BigInt(id),true],
    account: address

  })

  const {data: updateInspectionStatusData, writeAsync: writeInspectionStatus} = useContractWrite(updateInspectionStatus);


  
  const buyHandler = useCallback(async () => {

    writeDeposit?.call
    
    
  }, [writeDeposit])

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price);


  //called when a buyer wants to bBigInt(id)/ put a buying offer. (signed) (contract not modified yet)
  /*const {data: offer } = useContractWrite({
    abi: escrowContract.abi,
    address: config.contracts.Escrow.address as Address,
    functionName:'makeOffer',
    args: [{buyer: account}, {amount: amount*1e9}],
    signer: ethers.getSigner()
    value: amount*1e9
    });*/

  // Will have to change this for a usecontract write and then write then new price on the contract. 
  
  
  const [buttonLabel, setButtonLabel] = useState("Make Offer");
  const [buttonAction, setButtonAction] = useState(() => () => {});
  const [offer, setOffer] = useState(0);


  useEffect(() => {
   if(role) 
    switch (role) {
      case 'inspector':
        setButtonLabel('Approve');
     //   setButtonAction(inspectHandler);
        break;
      case 'notary':
        setButtonLabel('Inspect');
    //    setButtonAction(notaryHandler);
        break;
      case 'lender':
        setButtonLabel('Lend');
     //   setButtonAction(null);
        break;
      case 'seller':
        setButtonLabel('Sell');
        //setButtonAction(null);
        break;
      default:
        setButtonLabel('Buy');
   //     setButtonAction(() => {
     //     null
     //   });
        break;
        
        purchasePrice
        escrowAmount
    }
  }, [role, escrowAmount, purchasePrice, setButtonLabel]);


  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hBigInt(id)den">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">
         Asking Price: {purchasePrice as number}
        </div>
      </div>
      <hr />
      <div className="p-4">
        <label>
          Minimum deposit:
          <input 
            type="number" 
            value={escrowAmount as number} 
            //onChange={e => setOffer(Number(e.target.value))} 
          />
        </label>
      </div>
      <hr />
      <div className="p-4"> 
        <Button 
          label={buttonLabel} 
          disabled={!escrowAmount ||!purchasePrice}
          onClick={() => writeDeposit()}
         // onClick={clicked=nul}
        />
      </div>
    </div>
  ); 
}
 
export default ListingBuy;
