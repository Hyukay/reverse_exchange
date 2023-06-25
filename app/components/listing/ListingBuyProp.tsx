'use client';
import { useState, useEffect } from "react";
import Button from "../Button";
import getCurrentUser from '../../actions/getCurrentUser';
import { useContractRead } from 'wagmi' 
import config from '../../../config.json';
import escrowContract from '../../../artifacts/contracts/Escrow.sol/Escrow.json'
import { sepolia } from 'wagmi';
import { Address } from "@/app/types";






interface ListingBuyProps {
  price: number;
 /* buyer: string | null;
  lender: string| null;
  inspector: string | null;
  seller: string  | null;*/
  
}


const ListingBuy: React.FC<ListingBuyProps> = ({
  price,
  /*buyer,
  lender,
  inspector,
  seller,*/
}) => {

//Use usecontract read to get the current price of the listing
const { data: OnChainPrice } = useContractRead({
  abi: escrowContract.abi,
  address: config.contracts.Escrow.address as Address,
  functionName: 'purchasePrice',
  chainId: sepolia.id
})

  // convert the price in wei to ether

  const priceInEther = OnChainPrice as number/ 1000000000000000000

  // convert the price in ether to dollars by fetching current price of ether

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price);

  // Will have to change this for a usecontract write and then write then new price on the contract. 
  const [offer, setOffer] = useState(0);
  
  const [buttonLabel, setButtonLabel] = useState("Make Offer");
  const [buttonAction, setButtonAction] = useState(() => () => {});
  

 /* useEffect(() => {
    if (account === buyer) {
      setButtonLabel("Buy");
      
    } else if (account === lender) {
      setButtonLabel("Lend");
      
    } else if (account === inspector) {
      setButtonLabel("Inspect");
      
    } else if (account === seller) {
      setButtonLabel("Sell");
      
    }
  }, [account, buyer, lender, inspector, seller, buyHandler, lendHandler, inspectHandler, sellHandler]);
*/
  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">
          Asking Price: {formattedPrice}
        </div>
      </div>
      <hr />
      <div className="p-4">
        <label>
          Current Offer: 
          <input 
            type="number" 
            value={offer} 
            onChange={e => setOffer(Number(e.target.value))} 
          />
        </label>
      </div>
      <hr />
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
